using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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

        // Add specific relationship for FitnessPath
        public Guid? FitnessPathId { get; set; } // Nullable, in case they haven't chosen a path yet
        [ForeignKey(nameof(FitnessPathId))]
        public virtual FitnessPath FitnessPath { get; set; }
    }

}
