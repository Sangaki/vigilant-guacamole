using System;
using just_do.Contexts;
using just_do.Middlewares;
using just_do.Models.ActionModels.Authentication;
using just_do.Models.BaseModels;
using just_do.Options;
using just_do.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace just_do
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        private string dbString;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            dbString = Configuration["postgres:connectionString"];
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "JustDo API Documentation", Version = "v1" });
                c.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
                {
                    Description = "`Token only!!!` - without `Bearer_` prefix",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Scheme = "bearer"
                });
            });
                        
            services.AddDbContext<ApplicationContext>();
            
            services.AddMvcCore();
            services.AddIdentityServer()
                .AddDeveloperSigningCredential()
                .AddConfigurationStore(option =>
                    option.ConfigureDbContext = builder => builder.UseNpgsql(dbString))
                .AddOperationalStore(option =>
                    option.ConfigureDbContext = builder => builder.UseNpgsql(dbString));

            services.AddIdentity<User, IdentityRole>().AddEntityFrameworkStores<ApplicationContext>();

            services.AddScoped<UserManager<User>>();
            services.AddScoped<SignInManager<User>>();

            //jwt scope
            services.AddTransient<IAccountService, AccountService>();
            services.AddSingleton<IJwtHandler, JwtHandler>();
            services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddTransient<TokenManagerMiddleware>();
            services.AddTransient<ITokenManager, TokenManager>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddDistributedRedisCache(r =>
            {
                r.Configuration = Configuration["redis:connectionString"];
            });


            var jwtSection = Configuration.GetSection("jwt");
            var jwtOptions = new JwtOptions();
            jwtSection.Bind(jwtOptions);
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.Zero,
                    };
                });
            services.Configure<JwtOptions>(jwtSection);
            // end jwt scope

            services.AddControllersWithViews();
            services.AddAuthorization();
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "JustDo API Documentation");
            });

            app.UseMiddleware<TokenManagerMiddleware>();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapDefaultControllerRoute(); });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
            
                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}