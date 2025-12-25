import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import ResultCard from './components/ResultCard';
import AnalysisBreakdown from './components/AnalysisBreakdown';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Basic URL validation
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      // Direct call to backend (CORS is enabled on backend)
      const response = await axios.post('http://localhost:8000/analyze/static', {
        url: cleanUrl
      });

      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze website. Ensure the backend server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-background" />
      <div className="app-grid" />

      <div className="container relative z-10">
        <Header />

        <main>
          <UrlInput
            url={url}
            setUrl={setUrl}
            onSubmit={handleAnalyze}
            isLoading={loading}
          />

          {error && (
            <div className="card border-danger">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="animate-enter">
              <ResultCard result={result} />

              <div className="grid-responsive gap-6 mt-8">
                <AnalysisBreakdown analysis={result.static_analysis} />
                <Roadmap />
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="flex-center mt-12 opacity-80 hover:opacity-100 transition-opacity">
              <Roadmap />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
