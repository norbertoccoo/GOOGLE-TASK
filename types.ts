export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  details: string;
  completed: boolean;
  starred: boolean;
  subtasks: Subtask[];
  createdAt: number;
}

export interface TaskList {
  id:string;
  name: string;
  tasks: Task[];
}
