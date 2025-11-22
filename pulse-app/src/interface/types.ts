export type Activity = {
  id: string;
  date: string;
  type: string;
  duration: string;
};

export type Badge = {
  id: string;
  title: string;
  description?: string;
  icon?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: string;
  sessionsCount: number;
  exercisesCount: number;
  lastActivity?: string;
};
