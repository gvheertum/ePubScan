# Agent Notes

## Scope
- Repo contains an Azure Functions API in `Catalog.API`.
- Shared EF Core DAL/BLL lives in `ePubAnalyzer.Shared`.
- Active frontend is Next.js in `Catalog.Next/catalog`.
- `Catalog.NG` is an older Angular frontend and was not touched for this round.

## Findings
- The Next app was reading Postgres directly through Prisma rather than calling the Azure Functions API for catalog reads/writes.
- The catalog page loaded the full book dataset client-side after mount and filtered in the browser.
- The list query pulled full rows, including large text fields such as `Description`, even though the overview only needed summary fields.
- The book detail page queried the same record twice: once in `generateMetadata()` and once again in the page itself.
- Prisma client creation was not guarded with the standard singleton pattern, which can increase connection churn in dev/server reload scenarios.
- The C# API used read-then-save flows for partial updates, causing extra database roundtrips for simple status edits.
- `EpubAnalyzer.sln` currently references a missing project: `Catalog.KO/Catalog.KO.csproj`.

## Changes Made
- Next Prisma layer:
  - Added a singleton Prisma client in `Catalog.Next/catalog/lib/prisma.ts`.
  - Added cached catalog-summary reads and cached book-detail reads in `Catalog.Next/catalog/lib/bookrepository.ts`.
  - Catalog summary now selects only:
    - `BookID`
    - `Title`
    - `Author`
    - `ReadStatus`
    - `Medium`
    - `Status`
    - `NrOfPages`
- Next cache invalidation:
  - Write route handlers now call `revalidateTag('books')` and `revalidateTag('book:{id}')`.
- Frontend rendering:
  - `/books` now renders from a server-side cached fetch instead of client-side boot fetches.
  - Filtering is still instant in the browser, but it works against the lighter summary payload.
  - Added a redesigned landing page, header, catalog view, and refreshed detail page styling.
- C# API:
  - Added `AsNoTracking()` to read queries in `ePubAnalyzer.Shared/DAL/BookRepository.cs`.
  - Replaced read-then-update patterns for read badge/status/availability updates with direct attached-entity partial updates.
  - Replaced detail merge flow in `BooksFunction` with repository-driven partial detail updates to avoid the extra read.

## Validation
- `Catalog.API/Catalog.API.csproj` builds successfully.
- `Catalog.Next/catalog` passes `./node_modules/.bin/tsc --noEmit`.
- `npm run build` for the Next app is currently blocked in this environment by Prisma engine download/network access.
- Full solution build via `dotnet build EpubAnalyzer.sln` fails because the solution still references missing `Catalog.KO/Catalog.KO.csproj`.

## Good Next Steps
- If DB load is still high, add database indexes for the actual query patterns, especially on:
  - `BookID`
  - `ReadStatus`
  - `Author`
  - `Title`
- Consider moving the Next write API to batch/optimistic UI flows if users do many successive edits.
- If the catalog grows a lot, replace client-side filtering of the summary dataset with server-side search parameters and pagination.
- If you want consistent mutation behavior across clients, decide whether Next should remain the primary app API or whether reads/writes should be routed back through `Catalog.API`.

## Cautions
- The worktree was already heavily dirty before these edits. Avoid broad cleanup or line-ending normalization without an explicit request.
- `Catalog.Next/catalog/.env` exists and is untracked; treat it as local environment state.
