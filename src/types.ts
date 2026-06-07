/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

export enum TopicStatus {
  Planned = "Planned",
  InProgress = "In Progress",
  Completed = "Completed"
}

// Domain 1: Machine Learning Topic
export interface MLTopic {
  id: string;
  name: string;
  isCompleted: boolean;
  dateCompleted?: string; // YYYY-MM-DD
  note?: string;
}

// Domain 2: AI Project Milestone
export interface ProjectMilestone {
  id: string;
  name: string;
  isCompleted: boolean;
  dateCompleted?: string;
  note?: string;
}

// Domain 3: 30 Days AI Tool Day
export interface FIToolDay {
  id: string;
  name: string;
  isCompleted: boolean;
  dateCompleted?: string;
  note?: string;
}

// Domain 4: Daily DSA Problem
export interface DSALog {
  id: string;
  name: string;
  isCompleted: boolean;
  dateCompleted?: string;
  note?: string;
}

// Domain 5: Cloud Learning Topic
export interface CloudTopic {
  id: string;
  name: string;
  isCompleted: boolean;
  dateCompleted?: string;
  note?: string;
}

// Learning Journal Note
export interface LearningNote {
  id: string;
  taskId: string;
  taskName: string;
  domain: string; // 'ml' | 'project' | 'tools' | 'dsa' | 'cloud'
  content: string;
  createdAt: string; // ISO timestamp
  dateLabel: string; // e.g. "Saturday, June 7, 2026"
  timeLabel: string; // e.g. "2:15 PM"
}

// Streak Tracker
export interface StreakState {
  currentStreakCount: number;
  longestStreakCount: number;
  lastActiveDate?: string; // YYYY-MM-DD
}

// Gamification Badge
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string; // YYYY-MM-DD
  requirement: string;
}

// Entire Career growth OS State
export interface CareerOSState {
  mlTopics: MLTopic[];
  projectMilestones: ProjectMilestone[];
  aiToolsDays: FIToolDay[];
  dsaLogs: DSALog[];
  cloudTopics: CloudTopic[];
  streakState: StreakState;
  badges: Badge[];
  notes: LearningNote[];
  preferences?: {
    userName?: string;
  };
}
