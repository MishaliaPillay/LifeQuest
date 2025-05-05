"use client";

import React, { useState } from 'react';
import XpLevelCard from './xp-level';
import StreakTracker from './streaktracker';
import ActivityTabs from './activity-tabs';

const DashboardPage: React.FC = () => {
  const [userData] = useState({
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
  });

  const [activities] = useState([
    { id: 1, type: "Running", date: "2025-05-03", duration: 45, distance: 5.2, calories: 420, xp: 180 },
    { id: 2, type: "Yoga", date: "2025-05-02", duration: 60, calories: 240, xp: 120 },
    { id: 3, type: "Strength", date: "2025-05-01", duration: 50, calories: 380, xp: 150 },
    { id: 4, type: "Cycling", date: "2025-04-30", duration: 75, distance: 18.5, calories: 520, xp: 210 },
    { id: 5, type: "Running", date: "2025-04-29", duration: 30, distance: 3.5, calories: 280, xp: 100 },
    { id: 6, type: "Swimming", date: "2025-04-28", duration: 40, distance: 1.2, calories: 350, xp: 160 },
  ]);

  return (
    <div>
      <XpLevelCard
        name={userData.name}
        level={userData.level}
        xp={userData.xp}
        xpToNextLevel={userData.xpToNextLevel}
        badges={userData.badges}
      />
      <StreakTracker streaks={userData.streaks} />
      <ActivityTabs activities={activities} />
    </div>
  );
};

export default DashboardPage;
