// TODO: Refactor this to be about Task instances
import {StudyTask} from '../../_models/study-task';

export const mockStudyTask0: StudyTask = {id: '0', task_id: '0', study_id: '0', is_disabled: false, is_complete: true};
export const mockStudyTask1: StudyTask = {id: '1', task_id: '1', study_id: '0', is_disabled: true, is_complete: true};
export const mockStudyTask2: StudyTask = {id: '2', task_id: '2', study_id: '0', is_disabled: false, is_complete: false};
export const mockStudyTask3: StudyTask = {id: '3', task_id: '3', study_id: '0', is_disabled: true, is_complete: false};
export const mockStudyTask4: StudyTask = {id: '4', task_id: '0', study_id: '1', is_disabled: false, is_complete: true};
export const mockStudyTask5: StudyTask = {id: '5', task_id: '1', study_id: '1', is_disabled: true, is_complete: true};
export const mockStudyTask6: StudyTask = {id: '6', task_id: '2', study_id: '2', is_disabled: false, is_complete: false};
export const mockStudyTask7: StudyTask = {id: '7', task_id: '3', study_id: '2', is_disabled: true, is_complete: false};


export const mockStudyTasks: StudyTask[] = [
  mockStudyTask0,
  mockStudyTask1,
  mockStudyTask2,
  mockStudyTask3,
  mockStudyTask4,
  mockStudyTask5,
  mockStudyTask6,
  mockStudyTask7,
];
