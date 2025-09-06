import React from 'react';
import { useGoalContributorsQuery } from '../graphql/generated';
import ContributorCard from './ContributorCard';

interface GoalContributorsProps {
  goalId: string;
  onBack: () => void;
  onSelectCompany: (companyId: string) => void;
}

const GoalContributors: React.FC<GoalContributorsProps> = ({ 
  goalId, 
  onBack, 
  onSelectCompany 
}) => {
  console.log('GoalContributors rendered with goalId:', goalId);
  const { data: positiveData, loading: positiveLoading, error: positiveError } = useGoalContributorsQuery({
    variables: { goalId, direction: 'POSITIVE' },
    skip: !goalId,
  });

  const { data: negativeData, loading: negativeLoading, error: negativeError } = useGoalContributorsQuery({
    variables: { goalId, direction: 'NEGATIVE' },
    skip: !goalId,
  });

  const goal = positiveData?.getGoal || negativeData?.getGoal;
  const positiveContributors = positiveData?.getGoal?.contributorCompanies || [];
  const negativeContributors = negativeData?.getGoal?.contributorCompanies || [];

  const calculateRelativeImpact = (contributors: any[]) => {
    if (contributors.length === 0) return [];
    
    const values = contributors.map(contributor => Math.abs(parseInt(contributor.impact.toString())));
    const maxValue = Math.max(...values);
    
    return contributors.map(contributor => ({
      ...contributor,
      relativePercentage: (Math.abs(parseInt(contributor.impact.toString())) / maxValue) * 100
    }));
  };

  const positiveContributorsWithRelative = calculateRelativeImpact(positiveContributors);
  const negativeContributorsWithRelative = calculateRelativeImpact(negativeContributors);

  if (positiveLoading || negativeLoading) {
    return (
      <div className="goal-contributors">
        <div className="loading">Loading contributors...</div>
      </div>
    );
  }

  if (positiveError || negativeError) {
    return (
      <div className="goal-contributors">
        <div className="error">
          Error loading contributors: {positiveError?.message || negativeError?.message}
        </div>
        <div className="debug">
          <p>Goal ID: {goalId}</p>
          <p>Positive Error: {positiveError?.message}</p>
          <p>Negative Error: {negativeError?.message}</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="goal-contributors">
        <div className="error">Goal not found</div>
        <div className="debug">
          <p>Goal ID: {goalId}</p>
          <p>Positive Data: {JSON.stringify(positiveData)}</p>
          <p>Negative Data: {JSON.stringify(negativeData)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goal-contributors">
      <div className="goal-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Company
        </button>
        <h2>{goal.name}</h2>
        <div className="goal-description">{goal.description}</div>
      </div>
      
      <div className="contributors-grid">
        <div className="contributors-column positive-contributors">
          <h3>Top Positive Contributors</h3>
          {positiveContributorsWithRelative.length === 0 ? (
            <p className="no-contributors">No positive contributors found</p>
          ) : (
            positiveContributorsWithRelative.map((contributor, index) => (
              <ContributorCard
                key={index}
                company={contributor.company}
                impact={contributor.impact}
                factors={contributor.factors}
                relativePercentage={contributor.relativePercentage}
                isPositive={true}
                onSelect={onSelectCompany}
              />
            ))
          )}
        </div>

        <div className="contributors-column negative-contributors">
          <h3>Top Negative Contributors</h3>
          {negativeContributorsWithRelative.length === 0 ? (
            <p className="no-contributors">No negative contributors found</p>
          ) : (
            negativeContributorsWithRelative.map((contributor, index) => (
              <ContributorCard
                key={index}
                company={contributor.company}
                impact={contributor.impact}
                factors={contributor.factors}
                relativePercentage={contributor.relativePercentage}
                isPositive={false}
                onSelect={onSelectCompany}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalContributors;
