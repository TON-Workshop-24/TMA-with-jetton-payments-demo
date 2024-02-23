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


type AppContextProviderValue = {
  cart: Cart;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
}

const AppContextProvider = createContext<AppContextProviderValue>({
  cart: {},
  addProduct: () => {},
  removeProduct: () => {}
});

export const AppProvider = AppContextProvider.Provider;

export const useApp/useAppContext = () => useContext(AppContextProvider);
