using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using PersonEntity = LifeQuest.Domain.Person.Person;

namespace LifeQuest.Domain.Steps
{
    public class StepEntry : Entity<Guid>
    {
        public Guid PersonId { get; set; }
        public int Steps { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public int CaloriesBurned { get; set; }
        public virtual PersonEntity Person { get; set; }

        public StepEntry(Guid personId, int steps, DateTime date, string note, int caloriesBurned, PersonEntity person)
        {
            PersonId = personId;
            Steps = steps;
            Date = date;
            Note = note;
            CaloriesBurned = caloriesBurned;
            Person = person;
        }
        public StepEntry() { }
    }
}
