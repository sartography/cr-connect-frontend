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
    study_id: string;
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
