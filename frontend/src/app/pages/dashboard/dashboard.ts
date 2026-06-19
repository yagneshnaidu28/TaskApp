// pages/dashboard/dashboard.ts
// The main page after login
// Shows all tasks as cards, with Delete and Update buttons

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

    tasks = signal<Task[]>([]);
    isLoading = signal(true);
    errorMessage = signal('');
    deletingId = signal<number | null>(null); // track which task is being deleted

    constructor(
        private taskService: TaskService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Load tasks when component mounts
        this.loadTasks();
    }

    loadTasks(): void {
        this.isLoading.set(true);

        this.taskService.getAllTasks().subscribe({
            next: (tasks) => {
                this.tasks.set(tasks);
                this.isLoading.set(false);
            },
            error: (err) => {
                // 401 means token expired
                if (err.status === 401) {
                    this.authService.logout();
                }
                this.errorMessage.set('Failed to load tasks');
                this.isLoading.set(false);
            }
        });
    }

    goToAddTask(): void {
        this.router.navigate(['/task-form']);
    }

    goToEditTask(taskId: number): void {
        // Pass the task ID in the URL so task-edit can load it
        this.router.navigate(['/task-edit', taskId]);
    }

    deleteTask(taskId: number): void {
        if (!confirm('Are you sure you want to delete this task?')) return;

        this.deletingId.set(taskId);

        this.taskService.deleteTask(taskId).subscribe({
            next: () => {
                // Remove from local signal without re-fetching from API
                this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
                this.deletingId.set(null);
            },
            error: () => {
                this.errorMessage.set('Failed to delete task');
                this.deletingId.set(null);
            }
        });
    }

    logout(): void {
        this.authService.logout();
    }
}