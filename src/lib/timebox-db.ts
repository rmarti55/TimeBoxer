import type { Session } from "./types";

export type TimeboxSessionRow = {
  id: string;
  user_id: string;
  task: string;
  duration_minutes: number;
  started_at: string;
  completed_at: string;
  accomplished: boolean;
  note: string | null;
  notes: string | null;
};

export function rowToSession(row: TimeboxSessionRow): Session {
  return {
    id: row.id,
    task: row.task,
    durationMinutes: row.duration_minutes,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    accomplished: row.accomplished,
    note: row.note ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export function sessionToInsert(session: Session, userId: string) {
  return {
    id: session.id,
    user_id: userId,
    task: session.task,
    duration_minutes: session.durationMinutes,
    started_at: session.startedAt,
    completed_at: session.completedAt,
    accomplished: session.accomplished,
    note: session.note ?? null,
    notes: session.notes ?? null,
  };
}
