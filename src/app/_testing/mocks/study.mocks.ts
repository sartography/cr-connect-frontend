import {ProtocolBuilderStatus, Study} from '../../_models/study';

export const mockStudy0: Study = {
  id: '0',
  ind_number: '12345',
  last_updated: new Date(),
  protocol_builder_status: ProtocolBuilderStatus.IN_PROCESS,
  primary_investigator_id: 'Dr. Tricia Marie McMillan',
  sponsor: 'Sirius Cybernetics Corporation',
  title: 'Phase III Trial of Genuine People Personalities (GPP) Autonomous Intelligent Emotional Agents for Interstellar Spacecraft',
};

export const mockStudy1: Study = {
  id: '1',
  ind_number: '12345',
  last_updated: new Date(),
  protocol_builder_status: ProtocolBuilderStatus.IN_PROCESS,
  primary_investigator_id: 'Dr. Slartibartfast Magrathean',
  sponsor: 'CamTim',
  title: 'Pilot Study of Fjord Placement for Single Fraction Outcomes to Cortisol Susceptibility',
};

export const mockStudies: Study[] = [
  mockStudy0,
  mockStudy1,
];
