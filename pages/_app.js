// hna na5dem globals.css ta3i
import '@/styles/globals.css';
import { StoreProvider } from '@/utils/store/Store';
// import { StoreProvider } from '@/utils/store/Store';
// import { StoreProvider } from '@/utils/store/store';
import { NextUIProvider } from '@nextui-org/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // remove css for server side rendering
    const IntCssStyle = document.querySelector('#jss-server-side');
    if (IntCssStyle) {
      IntCssStyle.parentElement.removeChild(IntCssStyle);
    }
  }, []);

  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <NextUIProvider>
        <StoreProvider>
          <PayPalScriptProvider deferLoading={true}>
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </StoreProvider>
      </NextUIProvider>
    </SnackbarProvider>
  );
}
