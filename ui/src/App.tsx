import React, { useState } from 'react';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import GoalContributors from './components/GoalContributors';
import './App.css';

type ViewType = 'company' | 'goal';

const App: React.FC = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('company');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleViewGoalContributors = (goalId: string) => {
    console.log('Navigating to goal contributors for goal ID:', goalId);
    setSelectedGoalId(goalId);
    setCurrentView('goal');
  };

  const handleBackToCompany = () => {
    setCurrentView('company');
    setSelectedGoalId(null);
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentView('company');
  };

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
          {currentView === 'company' ? (
            selectedCompanyId ? (
              <CompanyDetail 
                companyId={selectedCompanyId} 
                onViewGoalContributors={handleViewGoalContributors}
              />
            ) : (
              <div className="placeholder">
                <h2>Select a company to view details</h2>
                <p>Choose a company from the list to see its impact on various goals.</p>
              </div>
            )
          ) : (
            selectedGoalId && (
              <GoalContributors 
                goalId={selectedGoalId}
                onBack={handleBackToCompany}
                onSelectCompany={handleSelectCompany}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
