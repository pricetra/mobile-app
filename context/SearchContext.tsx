import _ from 'lodash';
import { createContext, ReactNode, useState } from 'react';

export type SearchContextType = {
  searching: boolean;
  search?: string;
  setSearching: (searching: boolean) => void;
  setSearch: (search: string, debounce?: number) => void;
};

export const SearchContext = createContext({} as SearchContextType);

export type SearchContextProviderProps = {
  children: ReactNode;
};

export default function SearchContextProvider({ children }: SearchContextProviderProps) {
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState<string>();

  return (
    <SearchContext.Provider
      value={{
        searching,
        search,
        setSearching,
        setSearch: (search, debounce = 500) => {
          setSearching(true);
          _.debounce(() => {
            setSearch(search.trim());
          }, debounce)();
        },
      }}>
      {children}
    </SearchContext.Provider>
  );
}
