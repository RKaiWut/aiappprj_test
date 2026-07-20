import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import AssessmentPage from './pages/AssessmentPage';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import { submitAssessment } from './services/predictionService';
import { loadStoredResult, saveStoredResult } from './utils/storage';

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '');
  return hash === 'assessment' || hash === 'results' ? hash : 'home';
}

export default function App() {
  const [route, setRoute] = useState(() => (typeof window === 'undefined' ? 'home' : getRouteFromHash()));
  const [result, setResult] = useState(() => loadStoredResult());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    saveStoredResult(result);
  }, [result]);

  function navigate(nextRoute) {
    window.location.hash = nextRoute === 'home' ? '' : nextRoute;
    setRoute(nextRoute);
  }

  async function handleSubmitAssessment(values) {
    setLoading(true);
    try {
      const response = await submitAssessment(values);
      setResult(response);
      navigate('results');
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setResult(null);
    navigate('home');
  }

  function handleEditAssessment() {
    navigate('assessment');
  }

  return (
    <AppShell currentRoute={route} onNavigate={navigate}>
      {route === 'home' ? <HomePage onStartAssessment={() => navigate('assessment')} /> : null}
      {route === 'assessment' ? <AssessmentPage onSubmitAssessment={handleSubmitAssessment} loading={loading} onCancel={() => navigate('home')} /> : null}
      {route === 'results' ? <ResultsPage result={result} onRestart={handleRestart} onEditAssessment={handleEditAssessment} /> : null}
    </AppShell>
  );
}
