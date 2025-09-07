using System;
using System.IO;
using System.Linq;
using Api.Middlewares;
using Api.Utils;
using DotNetEnv;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Repositories.Config;
using Repositories.Core.AutoMapperConfig;
using Repositories.Core.Context;
using Repositories.Core.Validators;
using StackExchange.Redis;
using TicketResell.Api.Hubs;
using TicketResell.Repositories.Logger;
using TicketResell.Repositories.UnitOfWork;
using TicketResell.Services.Services.Carts;
using TicketResell.Services.Services.Categories;
using TicketResell.Services.Services.History;
using TicketResell.Services.Services.Mail;
using TicketResell.Services.Services.Payments;
using TicketResell.Services.Services.Ratings;
using TicketResell.Services.Services.Revenues;
using TicketResell.Services.Services.Tickets;
using IValidatorFactory = Repositories.Core.Validators.IValidatorFactory;

using TicketResell.Services.Services.Chatbox;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using TicketResell.Api.Middlewares;
Env.Load();
var builder = WebApplication.CreateBuilder(args);
Console.WriteLine("SQLServer string: " + Environment.GetEnvironmentVariable("SQLSERVER"));
builder.Services.Configure<AppConfig>(config =>
{
    config.SQLServer = Environment.GetEnvironmentVariable("SQLSERVER") ?? "default";
    config.BaseUrl = Environment.GetEnvironmentVariable("BASE_URL") ?? "http://localhost:3000";
    config.MomoPartnerCode = Environment.GetEnvironmentVariable("MOMO_PARTNER_CODE") ?? "default";
    config.MomoAccessKey = Environment.GetEnvironmentVariable("MOMO_ACCESS_KEY") ?? "default";
    config.MomoSecretKey = Environment.GetEnvironmentVariable("MOMO_SECRET_KEY") ?? "default";
    config.MomoApiUrl = Environment.GetEnvironmentVariable("MOMO_API_URL") ?? "https://test-payment.momo.vn/";
    config.TmnCode = Environment.GetEnvironmentVariable("VNPAY_TMN_CODE") ?? "default";
    config.HashSecret = Environment.GetEnvironmentVariable("VNPAY_HASH_SECRET") ?? "default";
    config.VnpayApiUrl = Environment.GetEnvironmentVariable("VNPAY_API_URL") ?? "default";
    config.PayPalClientId = Environment.GetEnvironmentVariable("PAYPAL_CLIENT_ID") ?? "default";
    config.PayPalSecret = Environment.GetEnvironmentVariable("PAYPAL_SECRET") ?? "default";
    config.PayPalApiUrl = Environment.GetEnvironmentVariable("PAYPAL_API_URL") ?? "https://api-m.sandbox.paypal.com";
    config.RapidapiKey = Environment.GetEnvironmentVariable("RAPIDAPI_KEY") ?? "default";
    config.SmtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? "default";
    config.SmtpPort = Environment.GetEnvironmentVariable("SMTP_PORT") ?? "default";
    config.Username = Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? "default";
    config.Password = Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? "default";
    config.FromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? "default";
    config.FromDisplayName = Environment.GetEnvironmentVariable("FROM_DISPLAY_NAME") ?? "default";
});
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("AppConfig"));


JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json",
    Environment.GetEnvironmentVariable("SQLServer"));

JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.Development.json",
    Environment.GetEnvironmentVariable("SQLServer"));

// Dbcontext configuration
builder.Services.AddDbContext<TicketResellManagementContext>();
Console.WriteLine("Redis string: "+(Environment.GetEnvironmentVariable("REDIS_CONNECTION")??"localhost:6379"));
var redisConnectionString = Environment.GetEnvironmentVariable("REDIS_CONNECTION") ?? "localhost:6379";
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect(redisConnectionString));
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "TicketResellCacheInstance";
});

// Automapper configuration
builder.Services.AddAutoMapper(typeof(AutoMapperConfigProfile));
builder.Services.AddSingleton<IAppLogger, AppLogger>();
builder.Services.AddScoped<IRevenueService, RevenueService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderDetailService, OrderDetailService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ISellConfigService, SellConfigService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IRevenueService, RevenueService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IRatingService, RatingService>();
builder.Services.AddScoped<IChatboxService, ChatboxService>();

builder.Services.AddHttpClient<IMomoService, MomoService>();
builder.Services.AddHttpClient<IVnpayService, VnpayService>();
builder.Services.AddHttpClient<IPaypalService, PaypalService>();


builder.Services.AddSingleton<IServiceProvider>(provider => provider);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<OrderDetailValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CategoryValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<TicketValidator>();
builder.Services.AddScoped<IValidatorFactory, ValidatorFactory>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://frontend:3000", Environment.GetEnvironmentVariable("BASE_URL") ?? "http://localhost:3000", "http://178.128.59.176:3000" )
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddSignalR();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TicketResellManagementContext>();
    var pendingMigrations = dbContext.Database.GetPendingMigrations();

    // Check if there are pending migrations
    if (pendingMigrations.Any())
    {
        dbContext.Database.Migrate();
        var isDocker = Environment.GetEnvironmentVariable("IS_DOCKER") == "true";
        string sqlFilePath;

        if (isDocker)
            sqlFilePath = Path.Combine(AppContext.BaseDirectory, "Database", "SampleData.sql");
        else
            sqlFilePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "TicketResell.Repositories", "Database", "SampleData.sql");
        sqlFilePath = Path.GetFullPath(sqlFilePath);
        if (File.Exists(sqlFilePath))
        {
            var sql = File.ReadAllText(sqlFilePath);
            dbContext.Database.ExecuteSqlRaw(sql);
        }
        else
        {
            Console.WriteLine($"Sample data file not found at: {sqlFilePath}");
        }
    }
    else
    {
        Console.WriteLine("No pending migrations found. Skipping sample data insertion.");
    }
}
app.UseMiddleware<OriginLoggingMiddleware>();
app.UseCors("AllowSpecificOrigin");
app.UseSession();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<ValidatorMiddleware>();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    options.DocumentTitle = "Swagger";
});

app.MapHub<ChatHub>("chat-hub");

app.Run();

JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.json", "default");
JsonUtils.UpdateJsonValue("ConnectionStrings:SQLServer", "appsettings.Development.json", "default");