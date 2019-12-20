import {GenericType} from './generic-type';
import {Links} from './links';
import {TaskSpecs} from './task';

export interface WorkflowSpec extends GenericType {
  name: string;
  description: string;
  task_spec_ids: string[];
  task_specs?: TaskSpecs;
  _links?: Links;
}

export interface Workflow extends GenericType {
  study_id: string;
  name: string;
}
