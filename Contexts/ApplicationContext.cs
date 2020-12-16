using just_do.Models.BaseModels;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace just_do.Contexts
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=ec2-52-208-138-246.eu-west-1.compute.amazonaws.com;Port=5432;Database=d158hirmftf7mq;Username=lodfkybiutsvox;Password=4575aa96c3765a4e74420ce60afe4761a011002c6bfce33a20344340916e4cbc;SslMode=Require;Trust Server Certificate=true");
        }
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }
    }
}