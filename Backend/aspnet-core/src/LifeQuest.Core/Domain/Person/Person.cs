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

        // Selected Path
        public Guid? PathId { get; set; }

        [ForeignKey(nameof(PathId))]
        public virtual Path? SelectedPath { get; set; }

        // Optional: list of paths followed in the past or available to choose from
        public virtual ICollection<Path> Paths { get; set; } = new List<Path>();
    }

}
