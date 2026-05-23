# Security TODOs

## Credentials in a gitignored file

`ePubAnalyzer.Analyzer/Secrets.cs` is correctly listed in `.gitignore` and has never been committed — the credentials are not in the git history.

As a precaution: if the `.gitignore` entry is ever accidentally removed, the file (which contains a live connection string) would be committed on the next `git add`. Consider moving to `dotnet user-secrets` or an environment variable to eliminate that risk entirely.

