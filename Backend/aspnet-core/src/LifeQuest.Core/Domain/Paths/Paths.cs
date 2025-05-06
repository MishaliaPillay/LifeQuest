using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace LifeQuest.Domain.Paths
{
    public abstract class Path : FullAuditedEntity<Guid>
    {
        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public Guid PersonId { get; set; }

        [ForeignKey(nameof(PersonId))]
        public virtual Person.Person Person { get; set; }
    }

}
