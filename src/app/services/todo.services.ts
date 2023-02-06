import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Injectable } from "@angular/core";
import { sortBy } from "lodash";
import { BehaviorSubject, map } from "rxjs";
import { Project } from "src/interfaces/project.interface";
import { Todo } from "src/interfaces/todo.interface";

@Injectable({
  providedIn: 'root',
})
export class TodosServices {

  todoList: Todo[] = [
    {
      id: 1674480957366,
      title: "Get milk",
      done: false,
      project: null
    },
    {
      id: 1674480965640,
      title: "Pet dog",
      done: false,
      project: null
    },
    {
      id: 1674480973165,
      title: "Eat grass",
      done: false,
      project: null
    }
  ];

  projects: Project[] = [
    {
      id: 1674480923746,
      title: "inbox",
      todos: [this.todoList[0]]
    },
    {
      id: 1674480943398,
      title: "Build to-do app",
      todos: [this.todoList[1], this.todoList[2]]
    }
  ];

  //set default open project to inbox
  currentOpenProject = this.projects[0];

  projectTodoSubject = new BehaviorSubject<Todo[]>(this.currentOpenProject.todos);

  // Observable for 'pending' todo's (not done)
  todoListObservablePending$ = this.projectTodoSubject.pipe(map(todos => todos.filter(x => !x.done)));

  // Observable for 'finished' todo's (done)
  todoListObservableDone$ = this.projectTodoSubject.pipe(map(todos => todos.filter(x => x.done)));

  // Show trash icon on mouse hover for both tasks and projects
  showHideTrashIcon(item: number): void {
    document.getElementById("delete-button" + item)!.classList.toggle('hidden');
  }

  deleteProject(projectItem: Project, viaTrashIcon: boolean): void {
    // Delete all the associated todo's
    this.todoList = this.todoList.filter(x => x.project !== projectItem);
    // Delete the actual project
    let projectIndex = this.projects.indexOf(projectItem);
    this.projects.splice(projectIndex, 1);
    if(viaTrashIcon && projectItem === this.currentOpenProject) {
      this.currentOpenProject = this.projects[0];
    }
    this.projectTodoSubject.next(this.currentOpenProject.todos);
  }

  public drop(event: CdkDragDrop<any[]>): void {
    // If the todo is dropped in the same project
    if (event.previousContainer === event.container) {
      moveItemInArray(this.currentOpenProject.todos, event.previousIndex, event.currentIndex);
    } else {
      // If the todo is dropped to a different project
      if (!(event.event.target instanceof HTMLElement)) return;
      let projectID = event.event.target.id;
      let project = this.projects.find(x => x.id === parseInt(projectID));
      if (project) {
        // change todo project to new project
        let todoID = event.item.element.nativeElement.id;
        let todo = this.todoList.find(x => x.id === parseInt(todoID));
        todo ? todo.project = project : null;
        // add todo to other project
        project.todos.push(todo!);
        // remove todo from previous project
        this.currentOpenProject.todos.splice(event.previousIndex, 1);
      }
    }
    // this.todoListSubject.next(this.todoList);
    this.projectTodoSubject.next(this.currentOpenProject.todos);
  }

}