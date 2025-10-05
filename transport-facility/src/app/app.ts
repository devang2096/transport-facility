import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  todayDate = new Date();
  constructor() {
    setInterval(() => this.todayDate = new Date(), 1000)
  }
  protected readonly title = signal('transport-facility');
}
