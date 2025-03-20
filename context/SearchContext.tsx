import _ from 'lodash';
import { createContext, ReactNode, useState } from 'react';

export type SearchContextType = {
  search: string;
  setSearch: (search: string) => void;
};

export const SearchContext = createContext({} as SearchContextType);

export type SearchContextProviderProps = {
  children: ReactNode;
};

export default function SearchContextProvider({ children }: SearchContextProviderProps) {
  const [search, setSearch] = useState('');

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch: _.debounce((s: string) => setSearch(s.trim()), 500),
      }}>
      {children}
    </SearchContext.Provider>
  );
}
