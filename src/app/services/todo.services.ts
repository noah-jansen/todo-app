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

  projects: Project[] = [
    {
      id: 1674480923746,
      title: "inbox",
      todos: []
    },
    {
      id: 1674480943398,
      title: "Build to-do app",
      todos: []
    }
  ];

  //set default open project to inbox
  currentOpenProject = this.projects[0];

  todoList: Todo[] = [
    {
      id: 1674480957366,
      title: "Get milk",
      done: false,
      project: this.projects[0],
      relativeIndex: 0
    },
    {
      id: 1674480965640,
      title: "Pet dog",
      done: false,
      project: this.projects[0],
      relativeIndex: 1
    },
    {
      id: 1674480973165,
      title: "Eat grass",
      done: false,
      project: this.projects[1],
      relativeIndex: 2
    }
  ];

  ngOnInit(): void {
    for (let i = 0; i < this.projects.length; i++) {
      for (let j = 0; j < this.todoList.length; j++) {
        if (this.todoList[j].project === this.projects[i]) {
          this.projects[i].todos.push(this.todoList[j]);
        }
      }
    }
  }

  todoListSubject = new BehaviorSubject<Todo[]>(this.todoList);

  projectTodoSubject = new BehaviorSubject<Todo[]>(this.currentOpenProject.todos);

  // Observable for 'pending' todo's (not done)
  todoListObservablePending$ = this.todoListSubject.pipe(map(todos => todos.filter(x => !x.done && x.project === this.currentOpenProject)));

  // Observable for 'finished' todo's (done)
  todoListObservableDone$ = this.todoListSubject.pipe(map(todos => todos.filter(x => x.done && x.project === this.currentOpenProject)));

  // Sort todo's by relativeIndex
  sortTodoList(): void {
    this.todoList = sortBy(this.todoList, ['relativeIndex']);
    this.todoListSubject.next(this.todoList);
  }

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
    if(viaTrashIcon) {
      this.currentOpenProject = this.projects[0];
    }
    this.todoListSubject.next(this.todoList);
  }

  public drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.todoList, event.previousIndex, event.currentIndex);
    } else {
      if (!(event.event.target instanceof HTMLElement)) return;
      let projectID = event.event.target.id;
      let project = this.projects.find(x => x.id === parseInt(projectID));
      if (project) {
        let todoID = event.item.element.nativeElement.id;
        let todo = this.todoList.find(x => x.id === parseInt(todoID));
        todo ? todo.project = project : null;
      }
    }
    this.todoListSubject.next(this.todoList);
  }

}