import {Study} from 'sartography-workflow-lib';
import {FormlyFieldConfig} from '@ngx-formly/core';

export type StudyActionBoolean = (study: Study) => boolean;

export type StudyActionMethod = (study: Study, ...params: any) => Study;

export interface StudyAction {
  showIf: StudyActionBoolean;
  buttonIcon: string;
  buttonLabel: string;
  tooltipText: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogFormFields?: FormlyFieldConfig[];
  method: string | StudyActionMethod;
}
