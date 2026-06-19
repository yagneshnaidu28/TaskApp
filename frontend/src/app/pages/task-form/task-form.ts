// pages/task-form/task-form.ts
// The "Add New Task" form — reached when user clicks "+ Add New Task"

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';

@Component({
    selector: 'app-task-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './task-form.html',
    styleUrl: './task-form.scss'
})
export class TaskFormComponent {

    // Form fields
    title = '';
    body = '';

    // UI state
    isLoading = signal(false);
    errorMessage = signal('');

    constructor(private taskService: TaskService, private router: Router) { }

    onSubmit(): void {
        if (!this.title.trim()) {
            this.errorMessage.set('Title is required');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.taskService.createTask({ title: this.title, body: this.body }).subscribe({
            next: () => {
                // Task created → go back to dashboard to see the new card
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.errorMessage.set(err.error?.detail || 'Failed to create task');
                this.isLoading.set(false);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}