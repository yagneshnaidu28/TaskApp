// app/app.ts
// Root component — just a shell that holds the router outlet
// All actual pages are loaded dynamically into <router-outlet>

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Task Manager';
}