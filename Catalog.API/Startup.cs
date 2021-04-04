using ePubAnalyzer.Shared.BLL;
using ePubAnalyzer.Shared.DAL;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

// [assembly: FunctionsStartup(typeof(Catalog.API.Startup))]
namespace Catalog.API
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
        
            //TODO: in real config object?
            //SOME KIND OF DI WOULD BE NICE :)
			var configuration = new ConfigurationBuilder()
				//.SetBasePath(context.FunctionAppDirectory)                    
				.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
				.AddEnvironmentVariables()
				.Build();


			
            builder.Services.AddScoped<BookLogic>(d => { 
                var cString = configuration.GetConnectionStringOrSetting("DefaultConnection");
                var dalimpl = new DALImplementation(cString);
                var logicFactory = new ePubAnalyzer.Shared.BLL.LogicFactory(dalimpl);
                return logicFactory.GetBookLogic();
            });	
        }
    }
}
