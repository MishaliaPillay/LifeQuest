using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using PersonEntity = LifeQuest.Domain.Person.Person;

namespace LifeQuest.Domain.Weight
{
    public class WeightEntry : Entity<Guid>
    {
        public Guid PersonId { get; set; }
        public float Weight { get; set; }
        public DateTime Date { get; set; }
        public string? Note { get; set; }
        public virtual PersonEntity Person { get; set; }
    }
}
