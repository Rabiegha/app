import React from 'react';

const SearchContext = React.createContext({
  filteredData: [], // Fournir une valeur par défaut pour filteredData
  searchQuery: '', // Fournir une valeur par défaut pour searchQuery
});

export default SearchContext;
