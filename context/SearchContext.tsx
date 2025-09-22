import _ from 'lodash';
import { createContext, ReactNode, useCallback, useState } from 'react';

export type SearchContextType = {
  searching: boolean;
  search?: string | null; // Set to undefined on initialization. null when no input is provided or cancelled.
  setSearching: (searching: boolean) => void;
  handleSearch: (search: string | null) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

export const SearchContext = createContext({} as SearchContextType);

export type SearchContextProviderProps = {
  children: ReactNode;
};

export default function SearchContextProvider({ children }: SearchContextProviderProps) {
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState<string | null>();
  const [searchOpen, setSearchOpen] = useState(false);

  const debouncedSetSearch = useCallback(
    _.debounce((search: string | null) => {
      setSearch(search?.trim() ?? null);
    }, 500),
    []
  );

  const handleSearch = (search: string | null, debounce: boolean = true) => {
    setSearching(true);
    if (!debounce) {
      setSearch(search?.trim() ?? null);
      return;
    }
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
        searchOpen,
        setSearchOpen,
      }}>
      {children}
    </SearchContext.Provider>
  );
}
