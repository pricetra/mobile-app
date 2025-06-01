import { type ClassValue, clsx } from 'clsx';
import convert from 'convert-units';
import { twMerge } from 'tailwind-merge';

import { postgresArrayToArray } from './strings';

import { Category, Product } from '@/graphql/types/graphql';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_DELIM = ' > ';

/**
 * This method creates an array with the parent and all it's child categories.
 * It uses the `path` and `expandedPathname` to create this list
 * @param category
 * @returns The parent category and all the nested child categories
 */
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

export function diffObjects<T extends Record<string, any>>(obj1: T, obj2: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj1) {
    if (!obj1.hasOwnProperty(key)) continue;
    if (JSON.stringify(obj1[key]) === JSON.stringify(obj2[key])) continue;
    result[key] = obj1[key];
  }
  return result;
}

export function toPrecision(n: number, p: number): string {
  return n < 1 ? n.toFixed(p - 1) : n.toPrecision(p);
}

export function metersToMiles(m: number) {
  return toPrecision(convert(m).from('m').to('mi'), 2);
}

export function incompleteProductFields(product: Product): string[] {
  const fields: string[] = [];
  if (product.name.trim() === '') {
    fields.push('name');
  }
  if (product.brand.trim() === '') {
    fields.push('brand');
  }
  if (product.categoryId.toString() === '0' || product.categoryId.toString() === '842') {
    fields.push('category');
  }
  return fields;
}
