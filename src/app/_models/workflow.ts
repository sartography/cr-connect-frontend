import {GenericType} from './generic-type';
import {BpmnFormJsonField} from './json';
import {Links} from './links';
import {Task, TaskSpecs} from './task';

export interface WorkflowSpec extends GenericType {
    name: string;
    description: string;
    task_spec_ids: string[];
    task_specs?: TaskSpecs;
    _links?: Links;
}

export interface Workflow extends GenericType {
    name: string;
    workflow_spec_id: string;
    is_completed?: boolean;
    data?: any;
    outer_workflow?: Workflow;
    workflow_spec?: WorkflowSpec;
    task_tree?: Task;
    last_task?: Task;
    _links?: Links;
}

export interface WorkflowProcess extends GenericType {
    name: string;
    categories: WorkflowSubprocess[];
}

export interface WorkflowSubprocess extends GenericType {
    name: string;
    steps: WorkflowStep[];
}

export interface WorkflowStep extends GenericType {
    name: string;
    form: WorkflowForm;
}

export interface WorkflowForm extends GenericType {
    name: string;
    fields: BpmnFormJsonField[];
}
