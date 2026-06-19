// core/services/task.service.ts
// Handles all CRUD operations for tasks
// Every method returns an Observable — Angular's way of handling async HTTP

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskCreate, TaskUpdate } from '../../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private readonly API_URL = 'http://localhost:8000/tasks';

    // HttpClient is injected by Angular — we don't create it manually
    constructor(private http: HttpClient) { }

    // GET /tasks/ → returns array of tasks
    getAllTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.API_URL}/`);
    }

    // GET /tasks/:id → returns single task (used to pre-fill edit form)
    getTaskById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.API_URL}/${id}`);
    }

    // POST /tasks/ → creates new task
    createTask(task: TaskCreate): Observable<Task> {
        return this.http.post<Task>(`${this.API_URL}/`, task);
    }

    // PUT /tasks/:id → updates existing task
    updateTask(id: number, task: TaskUpdate): Observable<Task> {
        return this.http.put<Task>(`${this.API_URL}/${id}`, task);
    }

    // DELETE /tasks/:id → deletes task (returns 204 No Content)
    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}