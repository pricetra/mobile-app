import { Text } from 'react-native';

import { PaginatorProps } from './PaginationSimple';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/Pagination';

export function SmartPagination({ onPageChange, paginator }: PaginatorProps) {
  const { page, numPages, prev, next } = paginator;

  function changePage(page?: number | null) {
    if (!page) return;
    onPageChange(page);
  }

  // Helper to create a safe page range
  const pages: (number | '...')[] = [];

  const firstPages = [1, 2];
  const lastPages = [numPages - 1, numPages];

  const middlePages = [page - 1, page, page + 1].filter((p) => p >= 1 && p <= numPages);

  // Add first two pages
  for (const p of firstPages) {
    if (p <= numPages) pages.push(p);
  }

  // Insert ellipsis if needed
  if (middlePages[0] > 3) pages.push('...');

  // Add middle pages
  for (const p of middlePages) {
    if (!pages.includes(p)) pages.push(p);
  }

  // Insert ellipsis if needed
  if (middlePages[middlePages.length - 1] < numPages - 2) pages.push('...');

  // Add last two pages
  for (const p of lastPages) {
    if (p > 0 && p !== 1 && !pages.includes(p)) pages.push(p);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onPress={() => changePage(prev)} disabled={!prev} />
        </PaginationItem>

        {/* Page links */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                onPress={() => changePage(p)}
                isActive={p === page}
                label={p.toString()}
              />
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext onPress={() => changePage(next)} aria-disabled={!next} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
