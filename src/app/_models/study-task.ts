import {GenericType} from './generic-type';

export interface StudyTask extends GenericType {
  study_id: string;
  task_id: string;
  is_complete: boolean;
  is_disabled: boolean;
}
