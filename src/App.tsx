import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import TabBar from './components/TabBar';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomeScreen from './screens/HomeScreen';
import OrganizationsListScreen from './screens/OrganizationsListScreen';
import CreateOrganizationScreen from './screens/CreateOrganizationScreen';
import OrganizationDetailsScreen from './screens/OrganizationDetailsScreen';
import FormsListScreen from './screens/FormsListScreen';
import CreateFormScreen from './screens/CreateFormScreen';
import FormDetailsScreen from './screens/FormDetailsScreen';
import EventsListScreen from './screens/EventsListScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import BlindTestScreen from './screens/BlindTestScreen';
import ResultsScreen from './screens/ResultsScreen';

function AppRoutes() {
  const location = useLocation();
  const hideTabBar = location.pathname.endsWith('/test');

  return (
    <>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/organizations" element={<OrganizationsListScreen />} />
        <Route path="/organizations/new" element={<CreateOrganizationScreen />} />
        <Route path="/organizations/:id" element={<OrganizationDetailsScreen />} />
        <Route path="/forms" element={<FormsListScreen />} />
        <Route path="/forms/new" element={<CreateFormScreen />} />
        <Route path="/forms/:id" element={<FormDetailsScreen />} />
        <Route path="/events" element={<EventsListScreen />} />
        <Route path="/events/new" element={<CreateEventScreen />} />
        <Route path="/events/:id" element={<EventDetailsScreen />} />
        <Route path="/events/:id/test" element={<BlindTestScreen />} />
        <Route path="/events/:id/results" element={<ResultsScreen />} />
      </Routes>
      {!hideTabBar && <TabBar />}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;
