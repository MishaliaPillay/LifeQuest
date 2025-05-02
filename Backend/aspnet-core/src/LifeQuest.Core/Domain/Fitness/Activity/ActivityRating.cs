using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LifeQuest.Domain.Fitness.Activity
{
    public enum ActivityRating
    {
        [Display(Name = "Very Bad")]
        VeryBad,

        [Display(Name = "Bad")]
        Bad,

        [Display(Name = "Neutral")]
        Neutral,

        [Display(Name = "Good")]
        Good,

        [Display(Name = "Very Good")]
        VeryGood,
    }
}
