import {GenericType} from './generic-type';

export interface StudyType extends GenericType {
  label: string;
  task_ids: number[];
}
