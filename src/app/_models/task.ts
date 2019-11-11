import {GenericType} from './generic_type';

export interface Task extends GenericType {
  id: number;
  label: string;
  isComplete: boolean;
  isDisabled: boolean;
}
