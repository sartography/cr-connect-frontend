import {ProtocolBuilderStatus, Study} from 'sartography-workflow-lib';

export interface StudyAction {
  showIf: (study: Study) => boolean;
  buttonIcon: string;
  buttonLabel: string;
  tooltipText: string;
  dialogTitle: string;
  dialogDescription: string;
  method: string;
}
