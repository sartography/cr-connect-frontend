import {GenericType} from './generic-type';

export enum StudyStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Study extends GenericType {
  title: string;
  type_id: number;
  percent_complete: number;
  last_updated?: Date;
  date_submitted?: Date;
  status: StudyStatus;
}
