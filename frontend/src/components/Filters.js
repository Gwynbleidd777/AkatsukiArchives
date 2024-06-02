// ParentComponent.js
import React, { useState } from 'react';
import AuthNav from './AuthNav.js';
import AllItems from '../pages/All Items/AllItems.js';

const ParentComponent = () => {
  const [filters, setFilters] = useState({
    sortType: null,
    selectedCategories: [],
    selectedItemTypes: [],
    selectedColors: [],
    searchQuery: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <AuthNav filters={filters} onFilterChange={handleFilterChange} />
      <AllItems filters={filters} />
    </>
  );
};

export default ParentComponent;
