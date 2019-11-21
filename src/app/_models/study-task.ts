import {GenericType} from './generic-type';

export interface StudyTask extends GenericType {
  study_id: number;
  task_id: number;
  is_complete: boolean;
  is_disabled: boolean;
}
