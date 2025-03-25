import _ from 'lodash';
import { createContext, ReactNode, useCallback, useState } from 'react';

export type SearchContextType = {
  searching: boolean;
  search?: string;
  setSearching: (searching: boolean) => void;
  handleSearch: (search: string) => void;
};

export const SearchContext = createContext({} as SearchContextType);

export type SearchContextProviderProps = {
  children: ReactNode;
};

export default function SearchContextProvider({ children }: SearchContextProviderProps) {
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState<string>();

  const debouncedSetSearch = useCallback(
    _.debounce((search: string) => {
      setSearch(search.trim());
    }, 500),
    []
  );

  const handleSearch = (search: string) => {
    setSearching(true);
    debouncedSetSearch.cancel();
    debouncedSetSearch(search);
  };

  return (
    <SearchContext.Provider
      value={{
        searching,
        search,
        setSearching,
        handleSearch,
      }}>
      {children}
    </SearchContext.Provider>
  );
}
