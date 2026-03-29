import React, { createContext } from 'react';

export interface AppState {
  organizations: import('../models/types').Organization[];
  forms: import('../models/types').TestingForm[];
  events: import('../models/types').TestingEvent[];
  submissions: import('../models/types').ParticipantSubmission[];
}

export type AppAction =
  | { type: 'ADD_ORGANIZATION'; payload: Omit<import('../models/types').Organization, 'id' | 'createdAt' | 'members'> & { adminName: string; adminEmail: string } }
  | { type: 'UPDATE_ORGANIZATION'; payload: import('../models/types').Organization }
  | { type: 'DELETE_ORGANIZATION'; payload: string }
  | { type: 'ADD_MEMBER'; payload: { organizationId: string; member: Omit<import('../models/types').Member, 'id'> } }
  | { type: 'REMOVE_MEMBER'; payload: { organizationId: string; memberId: string } }
  | { type: 'ADD_FORM'; payload: Omit<import('../models/types').TestingForm, 'id' | 'createdAt'> }
  | { type: 'UPDATE_FORM'; payload: import('../models/types').TestingForm }
  | { type: 'DELETE_FORM'; payload: string }
  | { type: 'ADD_EVENT'; payload: Omit<import('../models/types').TestingEvent, 'id' | 'createdAt'> }
  | { type: 'UPDATE_EVENT'; payload: import('../models/types').TestingEvent }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_SAMPLE_TO_EVENT'; payload: { eventId: string; sample: Omit<import('../models/types').Sample, 'id'> } }
  | { type: 'REMOVE_SAMPLE_FROM_EVENT'; payload: { eventId: string; sampleId: string } }
  | { type: 'ADD_SUBMISSION'; payload: Omit<import('../models/types').ParticipantSubmission, 'id' | 'submittedAt'> }
  | { type: 'ADD_INVITED_EMAIL'; payload: { eventId: string; email: string } }
  | { type: 'REMOVE_INVITED_EMAIL'; payload: { eventId: string; email: string } };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
