import {GenericType} from './generic-type';

export interface StudyType extends GenericType {
  id: number;
  label: string;
  task_ids: number[];
}
