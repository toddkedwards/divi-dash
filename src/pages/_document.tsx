import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Divly - Dividend Portfolio Management" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 