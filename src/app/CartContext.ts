import { createContext, useContext } from 'react';

type ProductEntity = {
  id: number;
  shortName: string;
  description: string;
  price: number;
  image: string;
}

export type Product = ProductEntity & {
  quantity: number;
}

export type Cart = Record<number, Product>;

type CartContextValue = {
  cart: Cart;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
}

const CartContext = createContext<CartContextValue>({
  cart: {},
  addProduct: () => {},
  removeProduct: () => {}
});

export const CartProvider = CartContext.Provider;

export const useCart = () => useContext(CartContext);
