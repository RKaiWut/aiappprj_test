import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import AssessmentPage from './pages/AssessmentPage';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import ChatPage from './pages/ChatbotPage';
import { submitAssessment } from './services/predictionService';
import {
  loadStoredAssessmentState,
  saveStoredAssessmentState
} from './utils/storage';

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '');
  return ['assessment', 'results', 'chat'].includes(hash)
    ? hash
    : 'home';
}

export default function App() {
  const [route, setRoute] = useState(() => (typeof window === 'undefined' ? 'home' : getRouteFromHash()));
  const [assessmentState, setAssessmentState] = useState(() =>
    loadStoredAssessmentState()
  );
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    saveStoredAssessmentState(assessmentState);
  }, [assessmentState]);

  function navigate(nextRoute) {
    window.location.hash = nextRoute === 'home' ? '' : nextRoute;
    setRoute(nextRoute);
  }

  async function handleSubmitAssessment(values) {
    setLoading(true);
    try {
      const response = await submitAssessment(values);
      setAssessmentState({
        ...response,
        sessionId: null
      });

      navigate('results');
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setAssessmentState(null);
    setChatMessages([]);
    navigate('home');
  }

  function handleEditAssessment() {
    navigate('assessment');
  }

  return (
    <AppShell currentRoute={route} onNavigate={navigate}>
      {route === 'home' ? <HomePage onStartAssessment={() => navigate('assessment')} /> : null}
      {route === 'assessment' ? <AssessmentPage onSubmitAssessment={handleSubmitAssessment} loading={loading} onCancel={() => navigate('home')} /> : null}
      {route === 'results' ? <ResultsPage assessmentState={assessmentState} onRestart={handleRestart} onEditAssessment={handleEditAssessment} onOpenChat={() => navigate('chat')} /> : null}
      {route === 'chat' ? (<ChatPage
        assessmentState={assessmentState}
        setAssessmentState={setAssessmentState}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        onBack={() => navigate('results')}
      />) : null}
    </AppShell>
  );
}
