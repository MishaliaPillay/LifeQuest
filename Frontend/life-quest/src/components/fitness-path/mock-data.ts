// data/mockData.ts
export const userData = {
    name: "Alex Chen",
    level: 14,
    xp: 7500,
    xpToNextLevel: 10000,
    avatar: null,
    badges: ["Early Bird", "Marathon Runner", "Weight Goal Champion"],
    streaks: {
      weight: 8,
      steps: 12,
      activities: 5
    }
  };
  
  export const activities = [
    { id: 1, type: "Running", date: "2025-05-03", duration: 45, distance: 5.2, calories: 420, xp: 180 },
    // Add more activity data here...
  ];
  
  export const weightData = [
    { date: '2025-04-01', weight: 83.2 },
    // Add more weight data here...
  ];
  
  export const stepData = [
    { date: '2025-04-28', steps: 8923 },
    // Add more step data here...
  ];
  
  export const activityTypes = ["Running", "Cycling", "Swimming", "Yoga", "Strength", "Other"];
  