# ePubScan

Simple tooling to analyze content of ePub files and allowing an export of the meta data of the epubs to a tabular HTML file. 

Solution contains 2 projects, 1 project for the analysis, 1 project for the catalog. The catalog will be a small ASP.NET MVC app that allows me to store the files I have and the reading status.


##Remarks
- EF is forced back to 2.0.0 since EFCore and Azure functions have errors on newer versions regarding System.Data.SQL
- Make sure to add the connectionstrings.json in the KO and Analyzer project
`
{
    "ConnectionStrings": {
    "DefaultConnection": "Server=XXXX;Initial Catalog=XXXX;Persist Security Info=False;User ID=XXXX;Password=XXXX;Connection Timeout=30;"
  }
}
`
- In the API have the local.settings.json file present with the following data:
`
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "dotnet" 
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=XXXX;Initial Catalog=XXXX;Persist Security Info=False;User ID=XXXX;Password=XXXX;Connection Timeout=30;"
  },
  "Host": {
    "LocalHttpPort": 7071,
    "CORS": "*"
  }
}
`

##Notes to self
- Use `func host start` in the API project to start the service
- The EF > 2.0 gave issues on EF Core (tested on mac) with messages regarding: System.Data.SqlClient is not supported on this platform