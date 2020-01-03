import {Links} from './links';
import {TaskSpecs} from './task';

export interface WorkflowSpec {
  id: string;
  name: string;
  description: string;
  task_spec_ids: string[];
  task_specs?: TaskSpecs;
  _links?: Links;
}

export interface Workflow {
  id: number;
  study_id: number;
  name: string;
}
