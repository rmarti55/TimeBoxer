export type Phase = "setup" | "running" | "review";

export interface Session {
  id: string;
  task: string;
  durationMinutes: number;
  startedAt: string;
  completedAt: string;
  accomplished: boolean;
  note?: string;
}
