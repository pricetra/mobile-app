import { Maybe, Price } from 'graphql-utils';
import { useMemo } from 'react';

export default function useCalculatedPrice({
  latestPrice,
  isExpired,
}: {
  latestPrice?: Maybe<Price>;
  isExpired: boolean;
}) {
  const calculatedPrice = useMemo(() => {
    if (!latestPrice) return 0;
    return !isExpired ? latestPrice.amount : (latestPrice.originalPrice ?? latestPrice.amount);
  }, [latestPrice, isExpired]);
  return calculatedPrice;
}
