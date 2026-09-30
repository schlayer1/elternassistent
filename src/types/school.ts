export interface TopicItem {
  id: string;
  title: string;
  badge: string;
  iconName: string;
  shortDesc: string;
  fullAnswer: string;
  keyPoints: string[];
  relatedQuestions: string[];
  category: 'prospective' | 'grade5' | 'daily' | 'careers' | 'digital' | 'formal';
}

export interface ChecklistItem {
  id: string;
  text: string;
  detail?: string;
  completed: boolean;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  items: ChecklistItem[];
}

export interface CareerPath {
  id: string;
  title: string;
  grade: string;
  target: string;
  badge: string;
  color: string;
  description: string;
  requirements: string[];
  exams: string[];
  nextSteps: string[];
}

export interface SchoolContact {
  id: string;
  role: string;
  name: string;
  detail?: string;
  detailExtra?: string;
  phone?: string;
  email?: string;
  officeHours?: string;
  location?: string;
  iconName: string;
}

export interface ScheduleBlock {
  period: string;
  time: string;
  label: string;
  isBreak?: boolean;
}
