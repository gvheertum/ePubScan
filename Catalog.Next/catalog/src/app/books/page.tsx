import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Header from "../../../components/header";
import BookCatalogClient from "../../../components/bookcatalogclient";
import BookRepository from "../../../lib/bookrepository";
import "./books.css"

const pageSize = 12;

function getSingleSearchParam(input: string | string[] | undefined): string | undefined {
    return Array.isArray(input) ? input[0] : input;
}

async function BookOverview({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const search = getSingleSearchParam(searchParams?.q);
    const readStatus = getSingleSearchParam(searchParams?.status);
    const pageValue = Number.parseInt(getSingleSearchParam(searchParams?.page) ?? "1", 10);
    const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
    const catalogPage = await new BookRepository().getBookCatalogPage({
        page,
        pageSize,
        search,
        readStatus,
    });

    return <>
        <Header />
        <main className="page-container">
            <BookCatalogClient catalogPage={catalogPage} />
        </main>
    </>
}

export default withPageAuthRequired(BookOverview, { returnTo: "/books" });
