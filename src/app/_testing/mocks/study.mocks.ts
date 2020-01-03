import {ProtocolBuilderStatus, Study} from '../../_models/study';

export const mockStudy0: Study = {
  id: 0,
  ind_number: '12345',
  last_updated: new Date(),
  protocol_builder_status: ProtocolBuilderStatus.IN_PROCESS,
  primary_investigator_id: 'Dr. Tricia Marie McMillan',
  sponsor: 'Sirius Cybernetics Corporation',
  title: 'Phase III Trial of Genuine People Personalities (GPP) Autonomous Intelligent Emotional Agents for Interstellar Spacecraft',
};

export const mockStudy1: Study = {
  id: 1,
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

export const newRandomStudy = (): Study => {
  function _randomNumber(numChars: number): number {
    const chars = '0987654321';
    const resultArray = [];
    for (let i = 0; i < numChars; i++) {
      resultArray.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }
    return parseInt(resultArray.join(''), 10);
  }

  function _randomWords(numWords: number): string {
    const words = [
        'Reliance Agreement',
        'Evaluation',
        'Drug Interactions',
        'Channel Blockers',
        'Cortisol',
        'Trial',
        'Radiosurgery',
        'Brain Disease',
        'Susceptibility',
        'Strategies',
        'Outcomes',
        'Infections',
        'Neutropenia',
        'Patients',
        'Nephrology',
        'Workforce',
        'Project',
        'Ischemia',
        'Events',
        'Pilot Study',
        'Therapy',
        'Tolerance',
        'Decisions',
        'Radiation',
        'Cancer',
        'Tolerability'
    ];
    const resultArray = [];
    for (let i = 0; i < numWords; i++) {
      const index = Math.floor(Math.random() * words.length);
      resultArray.push(words[index]);
    }
    return resultArray.join(' ');
  }

  return {
    id: _randomNumber(5),
    ind_number: _randomNumber(5).toString(),
    last_updated: new Date(),
    protocol_builder_status: ProtocolBuilderStatus.IN_PROCESS,
    primary_investigator_id: _randomWords(3),
    sponsor: _randomWords(2),
    title: _randomWords(10),
  };
};
