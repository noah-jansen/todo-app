import { Project } from "./project.interface";

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  project: Project | null;
  tags: string[];
  deadline: Date | null;
}