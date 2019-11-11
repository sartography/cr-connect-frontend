import {GenericType} from './generic_type';

export interface StudyType extends GenericType {
  id: number;
  label: string;
  task_ids: number[];
}
