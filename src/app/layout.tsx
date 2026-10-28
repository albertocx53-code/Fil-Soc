import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Bricolage_Grotesque } from 'next/font/google';
import { Cabecalho } from '@/components/Cabecalho';
import { Rodape } from '@/components/brand';
import { Abertura } from '@/components/Abertura';
import { Revelar } from '@/components/Revelar';
import './globals.css';

const display = Bebas_Neue({ weight: '400', subsets: ['latin', 'latin-ext'], variable: '--font-bebas', display: 'swap' });
const ui = Bricolage_Grotesque({ subsets: ['latin', 'latin-ext'], variable: '--font-ui', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Fil&Soc · Filmes que viram aulas', template: '%s · Fil&Soc' },
  description:
    'Filmes, documentários, slides e fichas pedagógicas prontas para professores de Filosofia e Sociologia.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icons/icon-192.png' },
  appleWebApp: { capable: true, title: 'Fil&Soc', statusBarStyle: 'black-translucent' },
  openGraph: { title: 'Fil&Soc', description: 'Filmes que viram aulas. Aulas que viram debate.', type: 'website', locale: 'pt_BR' },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#0b0a0d', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

// Roda antes de pintar a tela: liga as animações de entrada e decide se a abertura aparece
// (só na primeira visita da sessão, e nunca para quem pediu menos movimento).
const PRE = `(function(){var d=document.documentElement;d.classList.add('js');try{var r=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('filsoc:abertura')){d.classList.add('sem-abertura')}else{d.classList.add('com-abertura');sessionStorage.setItem('filsoc:abertura','1')}}catch(e){d.classList.add('sem-abertura')}setTimeout(function(){d.classList.remove('com-abertura');if(!d.dataset.revelar){var a=document.querySelectorAll('.reveal');for(var i=0;i<a.length;i++)a[i].classList.add('is-in')}},4000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${ui.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE }} />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
        <Abertura />
        <div className="grain" aria-hidden="true" />
        <div className="app-shell">
          <Cabecalho />
          <main id="conteudo">{children}</main>
          <Rodape />
        </div>
        <Revelar />
      </body>
    </html>
  );
}
