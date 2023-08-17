import '@/styles/globals.scss';
import "@/styles/utils.css";
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Container, SSRProvider } from "react-bootstrap";
import style from "@/styles/App.module.css";
import NavBar from '@/components/NavBar';
import NextNProgress from "nextjs-progressbar";
import { Toaster } from 'react-hot-toast';
import SignUpModal from '@/components/auth/SignUpModal';

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Create Blog App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={inter.className}>
        <Toaster />
        <NextNProgress color='#F8C7CC' />
        <NavBar />
        <main>
          <Container className={style.pageContainer}>
            <Component {...pageProps} />
          </Container>
        </main>
        <SignUpModal onDismiss={() => { }} onLoginClicked={() => { }} />
      </div>
    </>

  )


}
