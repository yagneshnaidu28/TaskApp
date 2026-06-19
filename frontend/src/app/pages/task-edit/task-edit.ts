// pages/task-edit/task-edit.ts
// Pre-fills the form with existing task data then saves changes
// Gets the task ID from the URL: /task-edit/3

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../core/services/task.service';

@Component({
    selector: 'app-task-edit',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './task-edit.html',
    styleUrl: './task-edit.scss'
})
export class TaskEditComponent implements OnInit {

    // Form fields — will be filled from API response
    title = '';
    body = '';
    taskId: number = 0;

    // UI state
    isLoadingTask = signal(true);  // loading the task to pre-fill
    isSaving = signal(false);      // saving the updated task
    errorMessage = signal('');

    constructor(
        private taskService: TaskService,
        private router: Router,
        private route: ActivatedRoute  // reads URL parameters
    ) { }

    ngOnInit(): void {
        // Read :id from the URL → /task-edit/3 gives us "3"
        const idParam = this.route.snapshot.paramMap.get('id');

        if (!idParam) {
            this.router.navigate(['/dashboard']);
            return;
        }

        this.taskId = parseInt(idParam);
        this.loadTask();
    }

    loadTask(): void {
        this.taskService.getTaskById(this.taskId).subscribe({
            next: (task) => {
                // Pre-fill the form with existing values
                this.title = task.title;
                this.body = task.body || '';
                this.isLoadingTask.set(false);
            },
            error: () => {
                this.errorMessage.set('Task not found');
                this.isLoadingTask.set(false);
            }
        });
    }

    onSubmit(): void {
        if (!this.title.trim()) {
            this.errorMessage.set('Title is required');
            return;
        }

        this.isSaving.set(true);
        this.errorMessage.set('');

        this.taskService.updateTask(this.taskId, { title: this.title, body: this.body })
            .subscribe({
                next: () => {
                    // Updated → back to dashboard to see the change
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.errorMessage.set(err.error?.detail || 'Failed to update task');
                    this.isSaving.set(false);
                }
            });
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}