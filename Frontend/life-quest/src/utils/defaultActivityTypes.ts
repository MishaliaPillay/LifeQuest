// utils/defaultActivityTypes.ts

import { IActivity } from "../providers/fitnesspath/activity-provider/context";

export const defaultActivityTypes: IActivity[] = [
  {
    id: "0196a9d3-4d39-74fe-a3a9-03f1207aa9f4",
    category: "Strength Training",
    calories: 7,
    duration: "30 minutes",
    description:
      "Barbell Squats: 4 sets of 8-10 reps with 60-70% of 1RM, focusing on form and depth.",
  },
  {
    id: "0196af20-3766-7b87-9321-579cfba7f5cf",
    category: "Cardio",
    calories: 3,
    duration: "20 minutes",
    description: "Interval Running on Treadmill",
  },
  {
    id: "0196af69-a213-7d0f-befc-923c5af47f11",
    category: "Yoga",
    calories: 2,
    duration: "25 minutes",
    description:
      "Sun Salutation (Surya Namaskar) on the treadmill with slow, controlled movements to build strength and flexibility.",
  },
  {
    id: "0196afc0-782b-7ac9-8c13-c095e85420b8",
    category: "Boxing",
    calories: 3,
    duration: "15 minutes",
    description:
      "Shadow boxing with focus on footwork and basic punches (jab, cross, hook, uppercut) for 3 minutes, followed by 1 minute of rest. Repeat for 3 rounds.",
  }
]