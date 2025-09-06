import React, { useState } from 'react';
import { useCompanyListQuery } from '../graphql/generated';

interface CompanyListProps {
  onSelect: (id: string) => void;
  selectedCompanyId: string | null;
}

const CompanyList: React.FC<CompanyListProps> = ({ onSelect, selectedCompanyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useCompanyListQuery({
    variables: { page: currentPage },
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    // Assuming we have more pages if we get a full page of results
    if (data?.listCompanies && data.listCompanies.length > 0) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="company-list">
        <div className="loading">Loading companies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-list">
        <div className="error">Error loading companies: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="company-list">
      <h2>Companies</h2>
      {data?.listCompanies.map((company) => (
        <div
          key={company.id}
          className={`company-item ${selectedCompanyId === company.id ? 'selected' : ''}`}
          onClick={() => onSelect(company.id)}
        >
          <div className="company-name">{company.name}</div>
          <div className="company-sector">{company.sector}</div>
        </div>
      ))}
      
      <div className="pagination">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="pagination-info">
          Page {currentPage}
        </div>
        <button 
          onClick={handleNextPage}
          disabled={!data?.listCompanies || data.listCompanies.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyList;
