import {Study} from 'sartography-workflow-lib';
import {StudyAction} from './study-action';
import {FormlyFieldConfig} from '@ngx-formly/core';

export interface ConfirmStudyStatusDialogData {
  action: StudyAction;
  study: Study;
  confirm: boolean;
  formFields?: FormlyFieldConfig[];
  model?: any;
}
