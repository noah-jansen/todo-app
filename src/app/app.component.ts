import { Component} from '@angular/core';
import { TodosServices } from './services/todo.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-own-todo';
  constructor(public todoServices: TodosServices) {}
}