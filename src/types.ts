/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CVAnalysis {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  formattingAdvice: string;
  roleFitRating: string; // e.g. "Good Match", "Needs Adjustments"
  suggestedBulletPoints?: string[]; // Copyable impact-driven CV accomplishment bullet points (STAR formula)
  generatedFormattedCv?: string;   // Fully formatted Markdown of a professional CV based on user data
}

export interface InterviewMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  milestones: string[];
  status: 'pending' | 'active' | 'completed';
}

export interface SkillGapAnalysis {
  careerGoal: string;
  roadmap: RoadmapStep[];
  currentSkillsAssessment: string;
  essentialSkillsToLearn: string[];
}

export interface LinkedInOptimization {
  originalHeadline: string;
  originalSummary: string;
  optimizedHeadline: string;
  optimizedSummary: string;
  keyChanges: string[];
  brandingTips: string[];
}
