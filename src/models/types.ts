export interface Organization {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: Member[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface CriterionDefinition {
  id: string;
  name: string;
  description: string;
  minValue: number;
  maxValue: number;
}

export interface TestingForm {
  id: string;
  name: string;
  description: string;
  category: string;
  criteria: CriterionDefinition[];
  createdAt: string;
  organizationId: string;
}

export interface TestingEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  formId: string;
  organizationId: string;
  status: 'upcoming' | 'active' | 'completed';
  samples: Sample[];
  invitedEmails: string[];
  createdAt: string;
}

export interface Sample {
  id: string;
  code: string;
  revealName?: string;
}

export interface CriterionScore {
  criterionId: string;
  value: number;
  note: string;
}

export interface SampleEvaluation {
  sampleId: string;
  scores: CriterionScore[];
  overallComment: string;
}

export interface ParticipantSubmission {
  id: string;
  eventId: string;
  participantName: string;
  evaluations: SampleEvaluation[];
  submittedAt: string;
}
