using ePubAnalyzer.Shared.BLL;
using ePubAnalyzer.Shared.DAL;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Catalog.API.Helpers;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

//[assembly: FunctionsStartup(typeof(Catalog.API.Startup))]
namespace Catalog.API
{
    //public class Startup : FunctionsStartup
    //{
    //    public override void Configure(IFunctionsHostBuilder builder)
    //    {
    //        //TODO: in real config object?
    ////        var configuration = new ConfigurationBuilder()
    ////            .SetBasePath(builder.GetContext().ApplicationRootPath)           
				////.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
				////.AddEnvironmentVariables()
				////.Build();
            
    ////        //Register our services
    ////        builder.Services.AddTransient<DALImplementation>(d => new DALImplementation(configuration.GetConnectionStringOrSetting("DefaultConnection"))); 
    ////        builder.Services.AddTransient<LogicFactory>(d => new LogicFactory(d.GetRequiredService<DALImplementation>()));
    ////        builder.Services.AddTransient<BookLogic>(d => d.GetRequiredService<LogicFactory>().GetBookLogic());
    ////        builder.Services.AddTransient<BookPartialDataUpdateHelper, BookPartialDataUpdateHelper>();
    //    }
    //}

    public class Program
    {
        public static async Task Main(string[] args)
        {
            

            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()                
                .ConfigureServices(cd =>
                {
                    var configuration = new ConfigurationBuilder()
                      .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                      .AddEnvironmentVariables()
                      .Build();
                    
                    cd.AddLogging();

                    cd.AddTransient<DALImplementation>(d => new DALImplementation(configuration.GetConnectionStringOrSetting("DefaultConnection")));
                    cd.AddTransient<LogicFactory>(d => new LogicFactory(d.GetRequiredService<DALImplementation>()));
                    cd.AddTransient<BookLogic>(d => d.GetRequiredService<LogicFactory>().GetBookLogic());
                    cd.AddTransient<BookPartialDataUpdateHelper, BookPartialDataUpdateHelper>();
                })
                .Build();

            await host.RunAsync();
        }
    }
}
