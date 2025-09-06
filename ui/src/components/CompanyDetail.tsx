import React, { useState } from 'react';
import { useCompanyDetailQuery } from '../graphql/generated';

interface CompanyDetailProps {
  companyId: string;
  onViewGoalContributors: (goalId: string) => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ companyId, onViewGoalContributors }) => {
  const [openDrawers, setOpenDrawers] = useState<Set<string>>(new Set());
  const { data, loading, error } = useCompanyDetailQuery({
    variables: { id: companyId },
  });

  const toggleDrawer = (goalName: string) => {
    setOpenDrawers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalName)) {
        newSet.delete(goalName);
      } else {
        newSet.add(goalName);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="company-detail">
        <div className="loading">Loading company details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-detail">
        <div className="error">Error loading company details: {error.message}</div>
      </div>
    );
  }

  if (!data?.getCompany) {
    return (
      <div className="company-detail">
        <div className="error">Company not found</div>
      </div>
    );
  }

  const { name, sector, goalImpacts } = data.getCompany;

  // Separate positive and negative impacts
  const positiveImpacts = goalImpacts.filter(impact => impact.impact > 0);
  const negativeImpacts = goalImpacts.filter(impact => impact.impact < 0);

  const formatImpact = (impact: any) => {
    const value = parseInt(impact.toString());
    return value.toLocaleString();
  };

  // Calculate relative impact percentages for progress bars
  const calculateRelativeImpact = (impacts: any[]) => {
    if (impacts.length === 0) return [];
    
    const values = impacts.map(impact => Math.abs(parseInt(impact.impact.toString())));
    const maxValue = Math.max(...values);
    
    return impacts.map(impact => ({
      ...impact,
      relativePercentage: (Math.abs(parseInt(impact.impact.toString())) / maxValue) * 100
    }));
  };

  const positiveImpactsWithRelative = calculateRelativeImpact(positiveImpacts);
  const negativeImpactsWithRelative = calculateRelativeImpact(negativeImpacts);

  const renderProductFactors = (factors: any[]) => {
    if (!factors || factors.length === 0) {
      return <div className="no-factors">No contributing factors found</div>;
    }

    return factors.map((factor, index) => {
      const alignment = factor.alignment;
      const isDirect = alignment.__typename === 'DirectProductAlignment';
      
      return (
        <div key={index} className="product-factor">
          <div className="product-name">
            {alignment.product.name}
            {!isDirect && (
              <span className="via-indicator">
                via {alignment.viaProduct.name}
              </span>
            )}
          </div>
          <div className="alignment-level">
            {alignment.alignment}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="company-detail">
      <h2>{name}</h2>
      <div className="sector">Sector: {sector}</div>
      
      <div className="goal-impacts">
        <h3>Goal Contributions</h3>
        
        <div className="impacts-grid">
          <div className="impacts-column positive-impacts">
            <h4>Positive Impact</h4>
            {positiveImpactsWithRelative.length === 0 ? (
              <p className="no-impacts">No positive impacts found</p>
            ) : (
              positiveImpactsWithRelative.map((impact, index) => (
                <div key={index} className="goal-impact-item positive">
                  <div 
                    className="goal-card-header"
                    onClick={() => toggleDrawer(impact.goal.name)}
                  >
                    <div className="goal-header-row">
                      <div className="goal-name">{impact.goal.name}</div>
                      <button 
                        className="top-contributors-button-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Goal ID:', impact.goal.id);
                          onViewGoalContributors(impact.goal.id);
                        }}
                      >
                        Top Contributors
                      </button>
                    </div>
                    <div className="goal-description">{impact.goal.description}</div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar positive"
                        style={{ width: `${impact.relativePercentage}%` }}
                        title={`+${formatImpact(impact.impact)}`}
                      ></div>
                    </div>
                    <div className="drawer-toggle">
                      {openDrawers.has(impact.goal.name) ? '▼' : '▶'}
                    </div>
                  </div>
                  <div className={`goal-drawer ${openDrawers.has(impact.goal.name) ? 'open' : ''}`}>
                    <div className="drawer-content">
                      <h5>Contributing Factors</h5>
                      {renderProductFactors(impact.factors)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="impacts-column negative-impacts">
            <h4>Negative Impact</h4>
            {negativeImpactsWithRelative.length === 0 ? (
              <p className="no-impacts">No negative impacts found</p>
            ) : (
              negativeImpactsWithRelative.map((impact, index) => (
                <div key={index} className="goal-impact-item negative">
                  <div 
                    className="goal-card-header"
                    onClick={() => toggleDrawer(impact.goal.name)}
                  >
                    <div className="goal-header-row">
                      <div className="goal-name">{impact.goal.name}</div>
                      <button 
                        className="top-contributors-button-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Goal ID:', impact.goal.id);
                          onViewGoalContributors(impact.goal.id);
                        }}
                      >
                        Top Contributors
                      </button>
                    </div>
                    <div className="goal-description">{impact.goal.description}</div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar negative"
                        style={{ width: `${impact.relativePercentage}%` }}
                        title={`${formatImpact(impact.impact)}`}
                      ></div>
                    </div>
                    <div className="drawer-toggle">
                      {openDrawers.has(impact.goal.name) ? '▼' : '▶'}
                    </div>
                  </div>
                  <div className={`goal-drawer ${openDrawers.has(impact.goal.name) ? 'open' : ''}`}>
                    <div className="drawer-content">
                      <h5>Contributing Factors</h5>
                      {renderProductFactors(impact.factors)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
