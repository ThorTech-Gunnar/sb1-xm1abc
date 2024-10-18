import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';
import { Analytics } from '@vercel/analytics/react';
import fetchJson from '@/lib/fetchJson';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: fetchJson,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <Component {...pageProps} />
        <Toaster />
        <Analytics />
      </SWRConfig>
    </SessionProvider>
  );
}