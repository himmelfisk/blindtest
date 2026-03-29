import { useReducer, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Organization,
  TestingForm,
  TestingEvent,
  Member,
  Sample,
  ParticipantSubmission,
} from '../models/types';
import { AppContext, type AppState, type AppAction } from './appContextDef';

const initialState: AppState = {
  organizations: [],
  forms: [],
  events: [],
  submissions: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_ORGANIZATION': {
      const { adminName, adminEmail, ...orgData } = action.payload;
      const newOrg: Organization = {
        ...orgData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        members: [
          { id: uuidv4(), name: adminName, email: adminEmail, role: 'admin' },
        ],
      };
      return { ...state, organizations: [...state.organizations, newOrg] };
    }
    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case 'DELETE_ORGANIZATION':
      return {
        ...state,
        organizations: state.organizations.filter((o) => o.id !== action.payload),
        forms: state.forms.filter((f) => f.organizationId !== action.payload),
        events: state.events.filter((e) => e.organizationId !== action.payload),
      };
    case 'ADD_MEMBER': {
      const newMember: Member = { ...action.payload.member, id: uuidv4() };
      return {
        ...state,
        organizations: state.organizations.map((o) =>
          o.id === action.payload.organizationId
            ? { ...o, members: [...o.members, newMember] }
            : o
        ),
      };
    }
    case 'REMOVE_MEMBER':
      return {
        ...state,
        organizations: state.organizations.map((o) =>
          o.id === action.payload.organizationId
            ? { ...o, members: o.members.filter((m) => m.id !== action.payload.memberId) }
            : o
        ),
      };
    case 'ADD_FORM': {
      const newForm: TestingForm = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      return { ...state, forms: [...state.forms, newForm] };
    }
    case 'UPDATE_FORM':
      return {
        ...state,
        forms: state.forms.map((f) => (f.id === action.payload.id ? action.payload : f)),
      };
    case 'DELETE_FORM':
      return {
        ...state,
        forms: state.forms.filter((f) => f.id !== action.payload),
      };
    case 'ADD_EVENT': {
      const newEvent: TestingEvent = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      return { ...state, events: [...state.events, newEvent] };
    }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((e) => (e.id === action.payload.id ? action.payload : e)),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload),
      };
    case 'ADD_SAMPLE_TO_EVENT': {
      const newSample: Sample = { ...action.payload.sample, id: uuidv4() };
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.eventId
            ? { ...e, samples: [...e.samples, newSample] }
            : e
        ),
      };
    }
    case 'REMOVE_SAMPLE_FROM_EVENT':
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.eventId
            ? { ...e, samples: e.samples.filter((s) => s.id !== action.payload.sampleId) }
            : e
        ),
      };
    case 'ADD_SUBMISSION': {
      const newSub: ParticipantSubmission = {
        ...action.payload,
        id: uuidv4(),
        submittedAt: new Date().toISOString(),
      };
      return { ...state, submissions: [...state.submissions, newSub] };
    }
    case 'ADD_INVITED_EMAIL':
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.eventId
            ? { ...e, invitedEmails: [...e.invitedEmails, action.payload.email] }
            : e
        ),
      };
    case 'REMOVE_INVITED_EMAIL':
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.eventId
            ? { ...e, invitedEmails: e.invitedEmails.filter((em) => em !== action.payload.email) }
            : e
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
