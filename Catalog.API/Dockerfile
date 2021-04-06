FROM mcr.microsoft.com/azure-functions/dotnet:3.0
ENV AzureWebJobsScriptRoot=/home/site/wwwroot
ENV AzureFunctionsJobHost__Logging__Console__IsEnabled=true
ENV AZURE_FUNCTIONS_ENVIRONMENT=Development

WORKDIR /home/site/wwwroot
COPY /out/ .