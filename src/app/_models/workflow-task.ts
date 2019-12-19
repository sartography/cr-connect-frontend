import {GenericType} from './generic-type';
import {BpmnFormJsonField} from './json';

export interface WorkflowTask extends GenericType {
  name: string;
  state: string;
  type: string;
  form: BpmnFormJsonField;
}
