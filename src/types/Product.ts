export interface ProductListType {
  brandTitle: string;
  category: string;
  imageUrl: string;
  isSale?: boolean;
  likedCount: number;
  price: number;
  productId: number;
  productTitle: string;
  reviewCount: number;
  saleRank?: number;
  saleRate?: number;
  isNew?: boolean;
}

export interface ProductDetailType {
  description: string;
  howToUse: string;
  ingredients: string;
  productId: number;
}

export interface SelectedProductDetail extends ProductListType {
  description: string;
  ingredients: string;
  howToUse: string;
}

export interface arrProductDetailType {
  brandTitle: string;
  category: string;
  imageUrl: string;
  isSale?: boolean;
  likedCount: number;
  price: number;
  productId: number;
  productTitle: string;
  reviewCount: number;
  saleRank?: number;
  saleRate?: number;
  isNew?: boolean;
  description: string;
  howToUse: string;
  ingredients: string;
}
