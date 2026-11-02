export type FeedbackReason = 'auto_fallback' | 'user_downvote';

export interface UnansweredQuestion {
  id: string;
  timestamp: string;
  dateIso: string;
  language: string;
  question: string;
  answerSnippet: string;
  reason: FeedbackReason;
  reasonLabel: string;
  resolved: boolean;
}

export interface FeedbackLogPayload {
  question: string;
  answer: string;
  reason: FeedbackReason;
  language?: string;
}
