import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { postgresArrayToArray } from './strings';

import { Category } from '@/graphql/types/graphql';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_DELIM = ' > ';

export function categoriesFromChild(category: Category): Category[] {
  const path = postgresArrayToArray(category.path);
  const categoryNames = category.expandedPathname.split(CATEGORY_DELIM);
  const categories: Category[] = [];
  for (let i = 0; i < path.length; i++) {
    categories.push({
      id: path[i],
      path: `{${[...path].splice(0, i + 1).join(',')}}`,
      name: categoryNames[i],
      expandedPathname: [...categoryNames].splice(0, i + 1).join(CATEGORY_DELIM),
      depth: i + 1,
    });
  }
  return categories;
}
