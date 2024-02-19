import './App.scss'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import {Header} from "./components/Header/Header";
import {TxForm} from "./components/TxForm/TxForm";
import {Footer} from "./components/Footer/Footer";
import {TonProofDemo} from "./components/TonProofDemo/TonProofDemo";
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { OrderHistory } from './pages/OrderHistory';

const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: <Products />,
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/order-history',
        element: <OrderHistory />
      }
    ]
  }
])

function App() {
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
        <div className="app">
          <RouterProvider router={router} />

          {/*<Header />*/}
          {/*<TxForm />*/}
          {/*<TonProofDemo />*/}
          {/*<Footer />*/}
        </div>
      </TonConnectUIProvider>
  )
}

export default App
