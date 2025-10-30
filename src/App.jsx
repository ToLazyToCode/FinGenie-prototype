import { useState, useEffect } from 'react';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Section Components
import Overview from './components/overview/Overview';
import Mvp from './components/mvp/Mvp';
import Bmc from './components/bmc/Bmc';
import Roadmap from './components/roadmap/Roadmap';

function App() {
  const [activeSection, setActiveSection] = useState('overview');

  // Add Inter font from Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-slate-800">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-grow max-w-6xl mx-auto p-4 md:p-8 w-full">
        {activeSection === 'overview' && <Overview />}
        {activeSection === 'mvp' && <Mvp />}
        {activeSection === 'bmc' && <Bmc />}
        {activeSection === 'roadmap' && <Roadmap />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
