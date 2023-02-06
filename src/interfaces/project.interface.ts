import { Todo } from "./todo.interface";

export interface Project {
    id: number;
    title: string;
    todos: Todo[];
  }