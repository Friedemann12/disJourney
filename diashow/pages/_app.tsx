import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {JetBrains_Mono, Ubuntu} from 'next/font/google'


const jetbrains = JetBrains_Mono({
    weight: '400',
    subsets: ['latin'],
})

export default function App({Component, pageProps}: AppProps) {
    return (
        <main className={jetbrains.className}>
            <Component {...pageProps} />
        </main>)
}
