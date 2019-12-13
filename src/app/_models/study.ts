import {GenericType} from './generic-type';
import {IRBRequirement} from './irb';

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
  date_created?: Date;
  date_submitted?: Date;
  ind_number: string;
  last_updated: Date;
  pb_status: ProtocolBuilderStatus;
  percent_complete: number;
  pi: string;
  protocol_status?: ProtocolStatus;
  requirements?: IRBRequirement[];
  review_type?: string;
  sponsor: string;
  status?: StudyStatus;
  title: string;
  type_id: string;
}
