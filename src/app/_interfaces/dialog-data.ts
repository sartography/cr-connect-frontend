import {Study} from 'sartography-workflow-lib';
import {StudyAction} from './study-action';

export interface ConfirmStudyStatusDialogData {
  action: StudyAction;
  study: Study;
  confirm: boolean;
}
