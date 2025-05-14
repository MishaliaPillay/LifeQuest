using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using Abp.Domain.Entities.Auditing;
using LifeQuest.Authorization.Users;
using LifeQuest.Domain.Paths;
using LifeQuest.Domain.Paths.FitnessPath;
namespace LifeQuest.Domain.Person
{
    public class Person : FullAuditedEntity<Guid>
    {
        [Required]
        public long UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; }

        public int Xp { get; set; }

        public int Level { get; set; }

        public string? Avatar { get; set; }

        public virtual ICollection<Path> Paths { get; set; } = new List<Path>();

        public Guid? PathId { get; set; }
        [ForeignKey(nameof(PathId))]
        public virtual Path SelectedPath { get; set; }

        // AddXp method should be here
        public void AddXp(int amount, List<Level.LevelDefinition> levelDefinitions)
        {
            Xp += amount;

            var newLevel = levelDefinitions
                .OrderByDescending(ld => ld.RequiredXp)
                .FirstOrDefault(ld => Xp >= ld.RequiredXp)?.Level ?? 1;

            if (newLevel > Level)
            {
                Level = newLevel;
            }
        }
    }
}
