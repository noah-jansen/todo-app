import { Project } from "./project.interface";

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  project: Project;
  relativeIndex: number;
}