import React, { useState } from 'react';

interface ContributorCardProps {
  company: {
    id: string;
    name: string;
    sector: string;
  };
  impact: any;
  factors: any[];
  relativePercentage: number;
  isPositive: boolean;
  onSelect: (companyId: string) => void;
}

const ContributorCard: React.FC<ContributorCardProps> = ({
  company,
  impact,
  factors,
  relativePercentage,
  isPositive,
  onSelect
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const formatImpact = (impact: any) => {
    const value = parseInt(impact.toString());
    return value.toLocaleString();
  };

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
    <div className={`contributor-card ${isPositive ? 'positive' : 'negative'}`}>
      <div 
        className="contributor-card-header"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <div className="contributor-info">
          <div className="company-name">{company.name}</div>
          <div className="company-sector">{company.sector}</div>
        </div>
        <div className="progress-bar-container">
          <div 
            className={`progress-bar ${isPositive ? 'positive' : 'negative'}`}
            style={{ width: `${relativePercentage}%` }}
            title={`${isPositive ? '+' : ''}${formatImpact(impact)}`}
          ></div>
        </div>
        <div className="drawer-toggle">
          {isDrawerOpen ? '▼' : '▶'}
        </div>
      </div>
      <div className={`contributor-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <h5>Contributing Factors</h5>
          {renderProductFactors(factors)}
        </div>
      </div>
    </div>
  );
};

export default ContributorCard;
