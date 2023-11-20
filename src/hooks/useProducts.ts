import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getProductsList,
  getProductDetail,
  getLikeCountDocId,
  // listenProductsChange,
  subscribeToCartItems,
  getAllProductsList,
  // fetchProductDetail,
  // fetchProducts,
} from '../app/api/firesotre';
import { useEffect, useMemo, useState } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  productsListAtom,
  productDetailAtom,
  initialProductsListAtom,
  categoryAtom,
} from '@/atoms/ProductsListAtom';
import {
  ProductListType,
  ProductDetailType,
  cartItemType,
  SelectedProductDetailType,
  ProductsResponse,
} from '../types/Product';
import { CartItemUpdateAtom } from '@/atoms/CartItemAtom';
import { searchItemAtom } from '@/atoms/SearchListAtom';
import {
  mainIsNewAtom,
  mainRankingAtom,
  mainSaleRateAtom,
} from '@/atoms/MainListAtom';

export function useGetProductList(category?: string) {
  const setProductList = useSetRecoilState(productsListAtom);
  const setInitialProductList = useSetRecoilState(initialProductsListAtom);
  const setCategory = useSetRecoilState(categoryAtom);
  const {
    data: productsList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ['products', category],
    queryFn: (context) => getProductsList(category, context.pageParam),
    getNextPageParam: (lastPage) => lastPage?.lastDoc || null,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    retry: false,
    initialPageParam: undefined,
  });

  useEffect(() => {
    if (productsList && category) {
      if (!productsList) return;
      setCategory(category);

      const allProductList = productsList.pages.flatMap((p) => p.products);

      // 리스트에 할인된 가격 추가 -> 할인된 가격으로 필터링
      const updatedProductsList = allProductList.map((product) => {
        const { price, saleRate, isSale } = product;
        const discountedPrice = isSale
          ? price - (price * (saleRate || 0)) / 100
          : price;

        return { ...product, discountedPrice };
      });

      // 카테고리에 해당하는 상품 정렬
      const filteredProductList = updatedProductsList.filter((product) => {
        if (category === 'all') {
          return true;
        }
        return product.category === category;
      });

      setProductList(filteredProductList);
      setInitialProductList(filteredProductList);
    }
  }, [
    category,
    productsList,
    setInitialProductList,
    setProductList,
    setCategory,
  ]);

  return {
    isLoading,
    isError,
    productsList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    getProductsList,
  };
}

export function useGetProductDetail(productId: number) {
  const searchProductList = useRecoilValue(searchItemAtom);
  const mainRankingList = useRecoilValue(mainRankingAtom);
  const mainSaleRateList = useRecoilValue(mainSaleRateAtom);
  const mainIsNewList = useRecoilValue(mainIsNewAtom);
  const productsList = useRecoilValue(productsListAtom);
  const [localProductDetail, setLocalProductDetail] =
    useState<SelectedProductDetailType>();

  const {
    data: productDetail,
    isLoading,
    isError,
  } = useQuery<ProductDetailType>({
    queryKey: ['productDetail', productId],
    queryFn: () => getProductDetail(productId),
    refetchInterval: 1000,
  });

  const selectedProductDetail = useMemo(() => {
    const listCollection = [
      productsList,
      searchProductList,
      mainRankingList,
      mainSaleRateList,
      mainIsNewList,
    ];

    const findProductById = (list: ProductListType[]) =>
      list.find((product) => product.productId === productId);

    const filteredProductDetail = listCollection
      .map(findProductById)
      .find((product) => product && productDetail);

    return filteredProductDetail
      ? { ...filteredProductDetail, ...productDetail }
      : null;
  }, [
    mainIsNewList,
    mainRankingList,
    mainSaleRateList,
    productDetail,
    productId,
    productsList,
    searchProductList,
  ]);

  useEffect(() => {
    const savedProductDetail = localStorage.getItem(
      `productDetail_${productId}`
    );

    if (savedProductDetail) {
      setLocalProductDetail(JSON.parse(savedProductDetail));
    } else if (selectedProductDetail) {
      localStorage.setItem(
        `productDetail_${productId}`,
        JSON.stringify(selectedProductDetail)
      );
    }

    return () => {
      localStorage.removeItem(`productDetail_${productId}`);
    };
  }, [productId, selectedProductDetail]);

  return {
    productDetail: localProductDetail
      ? localProductDetail
      : selectedProductDetail,
    isLoading,
    isError,
  };
}

export function useGetLikeCountDocId(productId: number) {
  const { data: likeCountDocId } = useQuery({
    queryKey: ['likeCountDocId', productId],
    queryFn: () => getLikeCountDocId(productId),
  });

  return { likeCountDocId };
}

export function useGetCartItems(userId: number) {
  const setCartList = useSetRecoilState(CartItemUpdateAtom);

  const {
    isLoading,
    isError,
    error,
    data: cartItems,
  } = useQuery({
    queryKey: ['cartItems', userId],
    queryFn: () => subscribeToCartItems(userId),
    refetchInterval: 100,
  });

  useEffect(() => {
    if (cartItems) {
      setCartList(cartItems);
    }
    if (error) {
      setCartList([]);
    }
  }, [cartItems, error, setCartList]);

  return { isLoading, isError, data: cartItems };
}

export function useGetSearchList(keyword: string) {
  const setSearchList = useSetRecoilState(searchItemAtom);

  const {
    data: searchList,
    isLoading,
    isError,
  } = useQuery<ProductListType[]>({
    queryKey: ['searchList', keyword],
    queryFn: getAllProductsList,
  });

  useEffect(() => {
    if (searchList && keyword) {
      const lowerCaseKeyword = keyword.toLowerCase();

      const searchProductList = searchList.filter(
        (product) =>
          product.brandTitle.toLowerCase().includes(lowerCaseKeyword) ||
          product.productTitle.toLowerCase().includes(lowerCaseKeyword)
      );

      setSearchList(searchProductList);
    }
  }, [keyword, searchList, setSearchList]);

  return { isLoading, isError };
}

export function useGetMainList() {
  const setMainRankingList = useSetRecoilState(mainRankingAtom);
  const setMainSaleRateList = useSetRecoilState(mainSaleRateAtom);
  const setMainIsNewList = useSetRecoilState(mainIsNewAtom);

  const {
    data: productsList,
    isLoading,
    isError,
  } = useQuery<ProductListType[]>({
    queryKey: ['productsList'],
    queryFn: getAllProductsList,
  });

  useEffect(() => {
    if (productsList) {
      const saleRankSortedList = [...productsList]
        .sort(
          (a: ProductListType, b: ProductListType) =>
            (a.saleRank || 0) - (b.saleRank || 0)
        )
        .slice(0, 7);

      setMainRankingList(saleRankSortedList);

      const saleSaleRateSortedList = [...productsList]
        .sort(
          (a: ProductListType, b: ProductListType) =>
            (b.saleRate || 0) - (a.saleRate || 0)
        )
        .slice(0, 7);
      setMainSaleRateList(saleSaleRateSortedList);

      const saleIsNewSortedList = productsList
        .filter((product) => product.isNew)
        .slice(0, 7);
      setMainIsNewList(saleIsNewSortedList);
    }
  }, [productsList, setMainIsNewList, setMainRankingList, setMainSaleRateList]);

  return { isLoading, isError };
}

// // 더미데이터 리스트 불러오기
// export function useProductsList(category: string) {
//   const { data, isError, isLoading } = useQuery<ProductListType[]>({
//     queryKey: ['productsList'],
//     queryFn: fetchProducts,
//   });

//   const filteredProductsList = data?.filter(
//     (product) => product.category === category
//   );

//   return { productsList: filteredProductsList, isError, isLoading };
// }

// // 더미데이터 디테일 불러오기
// export function useProductDetail(productId: number) {
//   const { data, isError, isLoading } = useQuery<ProductDetailType[]>({
//     queryKey: ['productsDetail'],
//     queryFn: fetchProductDetail,
//   });

//   const filteredProductDetail = data?.filter(
//     (product) => product.productId === productId
//   );

//   return { productDetail: filteredProductDetail, isError, isLoading };
// }
