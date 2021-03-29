FROM mcr.microsoft.com/azure-functions/dotnet:2.0
ENV AzureWebJobsScriptRoot=/home/site/wwwroot

WORKDIR /app
COPY /out/ /home/site/wwwroot
#ENTRYPOINT ["dotnet", "Catalog.API.dll"]