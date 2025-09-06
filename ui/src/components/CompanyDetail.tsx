import React from 'react';
import { useCompanyDetailQuery } from '../graphql/generated';

interface CompanyDetailProps {
  companyId: string;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ companyId }) => {
  const { data, loading, error } = useCompanyDetailQuery({
    variables: { id: companyId },
  });

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

  return (
    <div className="company-detail">
      <h2>{name}</h2>
      <div className="sector">Sector: {sector}</div>
      
      <div className="goal-impacts">
        <h3>Goal Contributions</h3>
        {goalImpacts.length === 0 ? (
          <p>No goal contributions found for this company.</p>
        ) : (
          goalImpacts.map((impact, index) => (
            <div key={index} className="goal-impact-item">
              <div className="goal-name">{impact.goal.name}</div>
              <div className="impact-value">
                Impact: {impact.impact.toString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
