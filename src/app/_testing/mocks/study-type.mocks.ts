import {StudyType} from '../../_models/study-type';

export const mockStudyType0: StudyType = {id: 0, label: 'Expedited', task_ids: [0]};
export const mockStudyType1: StudyType = {id: 1, label: 'Full Board', task_ids: [0, 1]};

export const mockStudyTypes: StudyType[] = [
  mockStudyType0,
  mockStudyType1,
];
