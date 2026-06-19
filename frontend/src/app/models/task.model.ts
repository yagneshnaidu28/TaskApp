// models/task.model.ts
// These match EXACTLY what FastAPI returns in TaskResponse schema

export interface Task {
    id: number;
    title: string;
    body?: string;
    user_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface TaskCreate {
    title: string;
    body?: string;
}

export interface TaskUpdate {
    title?: string;
    body?: string;
}