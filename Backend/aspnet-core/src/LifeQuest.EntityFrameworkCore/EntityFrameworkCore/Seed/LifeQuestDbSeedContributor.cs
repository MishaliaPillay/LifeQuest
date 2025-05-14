using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using LifeQuest.Domain.Level;
using Abp.Data;

namespace LifeQuest
{
    public class LifeQuestDbSeedContributor : ITransientDependency
    {
        private readonly IRepository<LevelDefinition, int> _levelDefinitionRepo;

        public LifeQuestDbSeedContributor(IRepository<LevelDefinition, int> levelDefinitionRepo)
        {
            _levelDefinitionRepo = levelDefinitionRepo;
        }

        public async Task SeedAsync()
        {
            // Check if the LevelDefinitions table is already populated
            if (await _levelDefinitionRepo.CountAsync() > 0)
            {
                return;
            }

            var levels = new List<LevelDefinition>
            {
                new LevelDefinition { Level = 1, RequiredXp = 100 },
                new LevelDefinition { Level = 2, RequiredXp = 800 },
                new LevelDefinition { Level = 3, RequiredXp = 1500 },
                new LevelDefinition { Level = 4, RequiredXp = 3000 },
                new LevelDefinition { Level = 5, RequiredXp = 5000 }
            };

            foreach (var level in levels)
            {
                await _levelDefinitionRepo.InsertAsync(level);
            }
        }
    }
}
