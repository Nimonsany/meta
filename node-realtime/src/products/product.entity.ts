export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  images: string[];
  createdAt: Date;
}