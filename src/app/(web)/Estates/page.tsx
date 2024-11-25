'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { getEstates } from '@/libs/apis';
import { Estate } from '@/models/Estate';
import Search from '@/components/Search/Search';
import EstateCard from '@/components/EstateCard/EstateCard';

const Estates = () => {
  const [EstateTypeFilter, setEstateTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('searchQuery');
    const EstateType = searchParams.get('EstateType');

    if (EstateType) setEstateTypeFilter(EstateType);
    if (searchQuery) setSearchQuery(searchQuery);
  }, []);

  async function fetchData() {
    return getEstates();
  }

  const { data, error, isLoading } = useSWR('get/Estates', fetchData);

  if (error) throw new Error('Cannot fetch data');
  if (typeof data === 'undefined' && !isLoading)
    throw new Error('Cannot fetch data');

  const filterEstates = (Estates: Estate[]) => {
    return Estates.filter(Estate => {
      // Apply Estate type filter

      if (
        EstateTypeFilter &&
        EstateTypeFilter.toLowerCase() !== 'all' &&
        Estate.type.toLowerCase() !== EstateTypeFilter.toLowerCase()
      ) {
        return false;
      }

      //   Apply search query filter
      if (
        searchQuery &&
        !Estate.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredEstates = filterEstates(data || []);

  return (
    <div className='container mx-auto pt-10'>
      <Search
        EstateTypeFilter={EstateTypeFilter}
        searchQuery={searchQuery}
        setEstateTypeFilter={setEstateTypeFilter}
        setSearchQuery={setSearchQuery}
      />

      <div className='flex mt-20 justify-between flex-wrap'>
        {filteredEstates.map(Estate => (
          <EstateCard key={Estate._id} Estate={Estate} />
        ))}
      </div>
    </div>
  );
};

export default Estates;