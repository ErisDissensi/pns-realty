'use client';

import { useState } from 'react';

import Search from '../Search/Search';

const PageSearch = () => {
  const [EstateTypeFilter, setEstateTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Search
      EstateTypeFilter={EstateTypeFilter}
      searchQuery={searchQuery}
      setEstateTypeFilter={setEstateTypeFilter}
      setSearchQuery={setSearchQuery}
    />
  );
};

export default PageSearch;