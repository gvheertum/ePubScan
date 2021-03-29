FROM mcr.microsoft.com/azure-functions/dotnet:2.0
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true

WORKDIR /home/site/wwwroot
COPY /out/ .
#ENTRYPOINT ["dotnet", "Catalog.API.dll"]