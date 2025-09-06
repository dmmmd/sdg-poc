import React, { useState } from 'react';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import './App.css';

const App: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Upright - Company Impact Tracker</h1>
      </header>
      <div className="app-content">
        <aside className="sidebar">
          <CompanyList onSelect={setSelectedCompanyId} selectedCompanyId={selectedCompanyId} />
        </aside>
        <main className="main-content">
          {selectedCompanyId ? (
            <CompanyDetail companyId={selectedCompanyId} />
          ) : (
            <div className="placeholder">
              <h2>Select a company to view details</h2>
              <p>Choose a company from the list to see its impact on various goals.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
