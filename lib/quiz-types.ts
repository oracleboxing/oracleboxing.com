// lib/quiz-types.ts

/**
 * Represents a single quiz question option.
 */
export interface QuizOption {
  label: string;
  value: number;
}

/**
 * Represents a quiz question with its category and options.
 */
export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: QuizOption[];
}

/**
 * Mapping of question responses keyed by question id.
 */
export type QuizResponses = Record<number, number>;

/**
 * Computed scores for each skill dimension.
 */
export type DimensionScores = Record<string, number>;

/**
 * Definition of a quiz level threshold.
 */
export interface QuizLevel {
  name: string;
  min: number;
  max: number;
  description: string;
  detailedAdvice: string;
  ctaText: string;
  ctaUrl: string;
  ctaDescription: string;
  emoji: string;
  color: string;
}

/**
 * The result shape returned after quiz submission.
 */
export interface QuizResult {
  id: string;
  scores: DimensionScores;
  total: number;
  level: QuizLevel;
  created_at: string;
  responses: QuizResponses;
}
