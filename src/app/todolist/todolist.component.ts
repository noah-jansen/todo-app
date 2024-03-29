import { Component, OnInit } from '@angular/core';
import { Todo } from 'src/interfaces/todo.interface';
import { TodosServices } from '../services/todo.services';
import { ExpandStateService } from '../services/expanded-state.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { Observable, combineLatest, distinctUntilChanged, map, startWith } from 'rxjs';
import { FilterTagsPipe } from '../pipes/filter-tags.pipe';

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
      this.todoServices.todoList.filter(x => x.project === this.todoServices.projects[i]).forEach(x => this.todoServices.projects[i].todos.push(x));
    }
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
  }

  addTodoItem(): void {
    // creates unique id (milliseconds since 1970)
    const newId: number = Date.now();
    // creates new todo item
    const newItem: Todo = {id: newId, title: "", done: false, project: this.todoServices.currentOpenProject, tags: [], deadline: null};
    // adds new todo item to todo list
    this.todoServices.addTodoItem(newItem);
    // Timeout is used because it makes the focus input field async. Otherwise it results in null because the element is not yet rendered on page
    setTimeout(()=>{ 
      // focus input field to edit title
      document.getElementById(`todo-title${newId}`)?.focus();
    },0);
  }

  newTag: string = '';

  // for autocompleting new tags
  myControl = new FormControl();

  addTag(todo: Todo, tag: string): void {
    // if new tag is not a global tag, add to global tags and add to todo. Otherwise, find position in array of global tags and add
    const newTag = tag.trim();
    if (!todo.tags.includes(newTag)){
      if (!this.todoServices.tags.includes(newTag)) {
        this.todoServices.tags.push(newTag);
        let tagIndex = this.todoServices.tags.length - 1;
        todo.tags.push(this.todoServices.tags[tagIndex]);
      } else {
        let tagIndex = this.todoServices.tags.indexOf(newTag);
        todo.tags.push(this.todoServices.tags[tagIndex]);
      }
    }
  }

  removeTag(todo: Todo, tag: string): void {
    const tagIndex = todo.tags.indexOf(tag);
    if (tagIndex !== -1) {
      todo.tags.splice(tagIndex, 1);
    }
  }

  private filterTagsPipe = new FilterTagsPipe();

  filteredTags(todo: Todo | null): Observable<string[]> {
    const defaultTodo: Todo = {
      id: Date.now(),
      title: '',
      done: false,
      project: null,
      deadline: null,
      tags: []
    };
  
    return this.myControl.valueChanges.pipe(
      startWith(this.myControl.value),
      distinctUntilChanged(),
      map(value => this.filterTagsPipe.transform(this.todoServices.tags, todo || defaultTodo, value))
    );
  }

  // Check and uncheck items
  itemChecked(todoItem: Todo): void {
    todoItem.done = !todoItem.done;
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
    // Remove todo item from todo list
    const itemIndex = this.todoServices.todoList.indexOf(todoItem);
    this.todoServices.todoList.splice(itemIndex, 1);
    // Remove todo item from current project
    const projectItemIndex = this.todoServices.currentOpenProject.todos.indexOf(todoItem);
    this.todoServices.currentOpenProject.todos.splice(projectItemIndex, 1);
    this.todoServices.projectTodoSubject.next(this.todoServices.currentOpenProject.todos);
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