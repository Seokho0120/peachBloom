'use client';

import { productsListAtom } from '@/atoms/productsListAtom';
import { useRecoilValue } from 'recoil';
import Filter from './\bFilter';

type Props = {
  category: string;
};

export default function BrandList({ category }: Props) {
  const productsList = useRecoilValue(productsListAtom);
  const brandList = productsList.map((product) => product.brandTitle);

  // 필터에 들어갈 한글 컨텐츠
  // 그 한글을 클릭하면 그에 해당하는 순서로 list가 나와야함

  return (
    <section className='mb-6'>
      <h2 className='font-bold text-4xl text-slate-600'>
        {category.toUpperCase()}
        <div className=' border-b border-navypoint mt-4' />
      </h2>
      <ul className='flex p-10 bg-gray-100 gap-4 text-sm font-semibold text-slate-800'>
        <div>
          <Filter />
        </div>
        <p className='hover:text-gray-400'>전체+</p>
        {brandList.map((brand, idx) => (
          <li className='hover:text-gray-400 cursor-pointer' key={idx}>
            {brand}
          </li>
        ))}
      </ul>
    </section>
  );
}
