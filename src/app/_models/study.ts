import {GenericType} from './generic-type';

export enum StudyStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ProtocolBuilderStatus {
  IN_PROGRESS = 'In progress',
  COMPLETE = 'Complete',
}

export enum ProtocolStatus {
  PRE_REVIEW = 'Pre-review',
  POST_REVIEW = 'Post-review',
}

export interface Study extends GenericType {
  title: string;
  type_id: number;
  percent_complete: number;
  date_created?: Date;
  date_modified?: Date;
  date_submitted?: Date;
  status?: StudyStatus;
  review_type?: string;
  protocol_builder_status?: ProtocolBuilderStatus;
  protocol_status?: ProtocolStatus;
}
