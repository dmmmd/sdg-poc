import React, { useState, useEffect, useCallback } from 'react';
import { useCompanyListQuery, useFindCompaniesLazyQuery } from '../graphql/generated';

interface CompanyListProps {
  onSelect: (id: string) => void;
  selectedCompanyId: string | null;
}

const CompanyList: React.FC<CompanyListProps> = ({ onSelect, selectedCompanyId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data, loading, error } = useCompanyListQuery({
    variables: { page: currentPage },
  });

  const [findCompanies, { data: searchData, loading: searchLoading, error: searchError }] = useFindCompaniesLazyQuery();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Perform search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 3) {
      findCompanies({ variables: { partialName: debouncedSearchTerm.trim() } });
      setIsSearchMode(true);
    } else if (debouncedSearchTerm.trim().length === 0 && isSearchMode) {
      setIsSearchMode(false);
    }
  }, [debouncedSearchTerm, findCompanies, isSearchMode]);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim().length >= 3) {
      findCompanies({ variables: { partialName: searchTerm.trim() } });
      setIsSearchMode(true);
    }
  }, [searchTerm, findCompanies]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setIsSearchMode(false);
  }, []);

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

  // Determine which data to display
  const displayData = isSearchMode ? searchData?.findCompanies : data?.listCompanies;
  const displayLoading = isSearchMode ? searchLoading : loading;
  const displayError = isSearchMode ? searchError : error;

  return (
    <div className="company-list">
      <h2>Companies</h2>
      
      {/* Search Widget */}
      <div className="search-widget">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Company name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={searchTerm.trim().length < 3}
            className="search-button"
          >
            Find
          </button>
          <button
            onClick={handleClear}
            disabled={!isSearchMode && searchTerm.trim().length === 0}
            className="clear-button"
          >
            Clear
          </button>
        </div>
        {isSearchMode && (
          <div className="search-status">
            {searchLoading ? 'Searching...' : `Found ${displayData?.length || 0} companies`}
          </div>
        )}
      </div>

      {/* Company List */}
      {displayLoading ? (
        <div className="loading">Loading companies...</div>
      ) : displayError ? (
        <div className="error">Error loading companies: {displayError.message}</div>
      ) : (
        <>
          {displayData?.map((company) => (
            <div
              key={company.id}
              className={`company-item ${selectedCompanyId === company.id ? 'selected' : ''}`}
              onClick={() => onSelect(company.id)}
            >
              <div className="company-name">{company.name}</div>
              <div className="company-sector">{company.sector}</div>
            </div>
          ))}
          
          {/* Pagination - only show in normal mode */}
          {!isSearchMode && (
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
          )}
        </>
      )}
    </div>
  );
};

export default CompanyList;
