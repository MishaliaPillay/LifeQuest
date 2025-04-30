using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace LifeQuest.EntityFrameworkCore;

public static class LifeQuestDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<LifeQuestDbContext> builder, string connectionString)
    {
        builder.UseNpgsql(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<LifeQuestDbContext> builder, DbConnection connection)
    {
        builder.UseNpgsql(connection);
    }
}
