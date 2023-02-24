import { Component } from '@angular/core';
import { Project } from 'src/interfaces/project.interface';
import { TodosServices } from '../services/todo.services';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.css']
})

export class SidepanelComponent {
  
  constructor(public todoServices: TodosServices) {}

  openProject(project: Project): void {
    this.todoServices.currentOpenProject = project;
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
  }

  addProject(): void {
    const newProject = {
      id: Date.now(),
      title: "",
      todos: [],
    };
    this.todoServices.projects.push(newProject);
    this.openProject(newProject);
    this.editTitle();
  }

  editTitle(): void {
    document.getElementById("project-title")?.focus();
  }

  moveProject(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.todoServices.projects, event.previousIndex, event.currentIndex);
  }
  
}