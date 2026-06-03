/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  CareerOSState, 
  MLTopic, 
  ProjectMilestone, 
  FIToolDay, 
  DSALog, 
  CloudTopic, 
  Badge 
} from "./types";

// Every single domain starts completely empty as requested
export const initialMLTopics: MLTopic[] = [];

export const initialProjectMilestones: ProjectMilestone[] = [];

export const initialAIToolsDays: FIToolDay[] = [];

export const initialDSALogs: DSALog[] = [];

export const initialCloudTopics: CloudTopic[] = [];

// Simplified badges unlocked purely through real active task completion & streak metrics
export const initialBadges: Badge[] = [
  {
    id: "b-1",
    name: "First Step Completed",
    description: "Mark your first custom task of your journey as completed.",
    icon: "CheckCircle",
    requirement: "Complete at least 1 task"
  },
  {
    id: "b-2",
    name: "Consistency Rookie",
    description: "Successfully complete a total of 10 tasks.",
    icon: "Award",
    requirement: "Complete 10 total tasks"
  },
  {
    id: "b-3",
    name: "Journey Intermediate",
    description: "Complete 50 tasks across any of your learning sections.",
    icon: "Sparkles",
    requirement: "Complete 50 total tasks"
  },
  {
    id: "b-4",
    name: "Absolute Mastery",
    description: "Reach the grand pinnacle of 100 completed tasks.",
    icon: "Crown",
    requirement: "Complete 100 total tasks"
  },
  {
    id: "b-5",
    name: "One-Week Warrior",
    description: "Keep a continuous learning streak alive for 7 days.",
    icon: "Flame",
    requirement: "Achieve a 7-day completion streak"
  },
  {
    id: "b-6",
    name: "Monthly Pioneer",
    description: "Build exceptional habit consistency with a 30-day streak.",
    icon: "Zap",
    requirement: "Achieve a 30-day completion streak"
  },
  {
    id: "b-7",
    name: "100-Day Champion",
    description: "Earn immortal status in consistency with a 100-day streak.",
    icon: "TrendingUp",
    requirement: "Achieve a 100-day completion streak"
  }
];

// Fallback empty array to prevent type conflicts on initial references
export const initialDailyMissions: any[] = [];

// Reset all composite and streak metrics to zero initial values
export const defaultStreakState = {
  currentStreakCount: 0,
  longestStreakCount: 0,
  lastActiveDate: undefined
};
