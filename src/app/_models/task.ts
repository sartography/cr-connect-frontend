import {GenericType} from './generic-type';

export interface Task extends GenericType {
  id: number;
  label: string;
}
