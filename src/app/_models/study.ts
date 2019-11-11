import {Task} from './task';

export interface Study {
  id: number;
  title: string;
  type: string;
  tasks: Task[];
}
