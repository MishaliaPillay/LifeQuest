using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.Domain.Entities.Auditing;
using LifeQuest.Authorization.Users;

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

        // Adjust the type `Path` to your actual Path entity
        // public virtual ICollection<Paths> Paths { get; set; } = new List<Paths>();


    }
}
