'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, FC } from 'react';

type Props = {
  EstateTypeFilter: string;
  searchQuery: string;
  setEstateTypeFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
};

const Search: FC<Props> = ({
  EstateTypeFilter,
  searchQuery,
  setEstateTypeFilter,
  setSearchQuery,
}) => {
  const router = useRouter();

  const handleEstateTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setEstateTypeFilter(event.target.value);
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = () => {
    console.log(`Navigating to: /Estates?EstateType=${EstateTypeFilter}&searchQuery=${searchQuery}`);
    router.push(`/Estates?EstateType=${EstateTypeFilter}&searchQuery=${searchQuery}`);
  };

  return (
    <section className='bg-tertiary-light px-4 py-6 rounded-lg'>
      <div className='container mx-auto flex gap-4 flex-wrap justify-between items-center'>
        <div className='w-full md:1/3 lg:w-auto mb-4 md:mb-0'>
          <label className='block text-sm font-medium mb-2 text-black'>
            Estate Type
          </label>
          <div className='relative'>
            <select
              value={EstateTypeFilter}
              onChange={handleEstateTypeChange}
              className='w-full px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none'
            >
              <option value='All'>All</option>
              <option value='Basic'>Basic</option>
              <option value='Luxury'>Luxury</option>
              <option value='Suite'>Suite</option>
            </select>
          </div>
        </div>

        <div className='w-full md:1/3 lg:w-auto mb-4 md:mb-0'>
          <label className='block text-sm font-medium mb-2 text-black'>
            Search
          </label>
          <input
            type='search'
            id='search'
            placeholder='Search...'
            className='w-full px-4 py-3 rounded leading-tight dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white'
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>

        <button
          className='btn-primary'
          type='button'
          onClick={handleFilterClick}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default Search;
