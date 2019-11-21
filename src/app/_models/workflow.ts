import {GenericType} from './generic-type';
import {Links} from './links';
import {Task, TaskSpecs} from './task';

export interface WorkflowSpec extends GenericType {
  name: string;
  description: string;
  task_specs: TaskSpecs;
  _links?: Links;
}

export interface Workflow extends GenericType {
  name: string;
  workflow_spec_id: number;
  is_completed?: boolean;
  data?: any;
  outer_workflow?: Workflow;
  workflow_spec?: WorkflowSpec;
  task_tree?: Task;
  last_task?: Task;
  _links?: Links;
}
