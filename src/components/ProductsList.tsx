'use client';

import { productsListAtom } from '@/atoms/productsListAtom';
import { useGetProductList, useProductsList } from '@/hooks/useProducts';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';

type Props = {
  category: string;
};

export default function ProductsList({ category }: Props) {
  const { isLoading, isError } = useGetProductList(category);
  const productsList = useRecoilValue(productsListAtom);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className='w-full flex items-center justify-center gap-5'>
      {productsList?.map(
        ({ productTitle, productId, brandTitle, likedCount }) => (
          <Link key={productId} href={`/detail/${productId}`}>
            <h2>{productTitle}</h2>
            <div>{category}</div>
            <div>{likedCount}</div>
            <div>{brandTitle}</div>
          </Link>
        )
      )}
    </div>
  );
}
