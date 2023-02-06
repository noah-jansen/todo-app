import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/interfaces/todo.interface';
import { TodosServices } from '../services/todo.services';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})

export class TodolistComponent implements OnInit {

  //use todoServices in HTML
  constructor(public todoServices: TodosServices) {}

  //standard hide done items
  hideDoneItems: boolean = true;
  
  ngOnInit() {
    // Assign all the todo items to their respective project
    for (let i = 0; i < this.todoServices.projects.length; i++) {
      for (let j = 0; j < this.todoServices.projects[i].todos.length; j++) {
        this.todoServices.projects[i].todos[j].project = this.todoServices.projects[i];
      }
    }
    // this.todoServices.todoListSubject.next(this.todoServices.todoList);
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
  }

  addTodoItem(): void {
    let newId: number = Date.now();
    let newItem: Todo = {id: newId, title: "", done: false, project: this.todoServices.currentOpenProject};
    this.todoServices.todoList.unshift(newItem);
    this.todoServices.currentOpenProject.todos.unshift(newItem);
    // this.todoServices.todoListSubject.next(this.todoServices.todoList);
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
    // Timeout is used because it makes the focus input field async. Otherwise it results in null because the element is not yet rendered on page
    setTimeout(()=>{ 
      document.getElementById(`todo-title${newId}`)?.focus();
    },0);
  }

  // Check and uncheck items
  itemChecked(todoItem: Todo): void {
    todoItem.done = !todoItem.done;
    // this.todoServices.todoListSubject.next(this.todoServices.todoList);
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
  }

  changeTitle(todoItem: Todo, changeTodoTitleEvent: Event): void {
    if (!(changeTodoTitleEvent.target instanceof HTMLInputElement)) return;
    todoItem.title = changeTodoTitleEvent.target.value;
  }

  changeProjectTitle(inputChangeEvent: Event): void {
    if (!(inputChangeEvent.target instanceof HTMLInputElement)) return;
    this.todoServices.currentOpenProject.title = inputChangeEvent.target.value;
  }

  showHideDoneItems(): void {
    this.hideDoneItems = !this.hideDoneItems;
  }

  deleteTodo(todoItem: Todo): void {
    let itemIndex = this.todoServices.todoList.indexOf(todoItem);
    this.todoServices.todoList.splice(itemIndex, 1);
    let projectItemIndex = this.todoServices.currentOpenProject.todos.indexOf(todoItem);
    this.todoServices.currentOpenProject.todos.splice(projectItemIndex, 1);
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
    // this.todoServices.todoListSubject.next(this.todoServices.todoList);
  }

  // Todo's require a title
  deleteEmptyTodo(todoItem: Todo): void {
    if(todoItem.title === "") {
      this.deleteTodo(todoItem);
    }
  }

  // Projects require a title
  deleteEmptyProject(): void {
    if(this.todoServices.currentOpenProject.title === "") {
      this.todoServices.deleteProject(this.todoServices.currentOpenProject, false);
    }
  }

  // Unfocus inputfield on Enter keypress
  unfocusInputfield(enterKeypressEvent: Event): void {
    (enterKeypressEvent.target as HTMLInputElement).blur();
  }

  moveTodo(event: CdkDragDrop<Todo[]>) {
    this.todoServices.drop(event);
  }

}