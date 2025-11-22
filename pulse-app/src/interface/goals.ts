export interface Goal {
  id: number;
  userId: number;
  description: string;
  deadline: string | null;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface NewGoalInput {
  description: string;
  deadline?: string | null;
}
