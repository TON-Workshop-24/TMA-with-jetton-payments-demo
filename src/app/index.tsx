import './App.scss'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "../components/Header/Header";
import {TxForm} from "../components/TxForm/TxForm";
import {Footer} from "../components/Footer/Footer";
import {TonProofDemo} from "../components/TonProofDemo/TonProofDemo";
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { Products } from '../pages/Products';
import { Checkout } from '../pages/Checkout';
import { OrderHistory } from '../pages/OrderHistory';
import { useCallback, useLayoutEffect, useState } from 'react';
import { CartProvider, Cart, Product } from './CartContext';
import { useMiniApp, useViewport } from '@tma.js/sdk-react';
import { Routes } from '../constant';

const router = createBrowserRouter([
  {
    children: [
      {
        path: Routes.PRODUCTS,
        element: <Products />,
      },
      {
        path: Routes.CHECKOUT,
        element: <Checkout />
      },
      {
        path: Routes.ORDER_HISTORY,
        element: <OrderHistory />
      }
    ]
  }
])

function App() {
  const miniApp = useMiniApp();
  const viewport = useViewport();

  const [cart, setCart] = useState<Cart>({});

  const addProduct = useCallback((product: Product) => {
    setCart((previousState) => {
      if (!(product.id in previousState)) {
        return { ...previousState, [product.id]: { ...product, quantity: 1 }}
      }

      const previousQuantity = previousState[product.id].quantity

      return {
        ...previousState,
        [product.id]: { ...product, quantity: previousQuantity + 1}
      }
    })
  }, [])

  const removeProduct = useCallback((product: Product) => {
    setCart((previousState) => {
      if (!(product.id in previousState)) {
        return previousState;
      }

      const newQuantity = previousState[product.id].quantity - 1;

      if (newQuantity > 0) {
        return { ...previousState, [product.id]: { ...product, quantity: newQuantity }};
      }

      return Object.keys(previousState)
        .filter(key => key !== String(product.id))
        .reduce((accumulator, key) => ({
          ...accumulator,
          [key]: previousState[Number(key)]
        }), {});
    })
  }, [])

  useLayoutEffect(() => {
    miniApp.ready();
    miniApp.setHeaderColor('#ffffff');
    miniApp.setBackgroundColor('#ffffff');

    viewport.expand();
  }, [miniApp, viewport]);

  return (
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"]
          }
        ]
      }}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/tc_twa_demo_bot/start'
      }}
    >
      <CartProvider value={{ cart, addProduct, removeProduct }}>
        <div className="app">
          <RouterProvider router={router} />

          {/*<Header />*/}
          {/*<TxForm />*/}
          {/*<TonProofDemo />*/}
          {/*<Footer />*/}
        </div>
      </CartProvider>
    </TonConnectUIProvider>
  )
}

export default App
