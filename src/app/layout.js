import { Bodoni_Moda, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import ChromaBackground from '../components/ChromaBackground';
import SiteHeader from '../components/SiteHeader';
import { ThemeProvider } from '../components/ThemeProvider';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-display',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  style: ['italic'],
  variable: '--font-kicker',
});

export const metadata = {
  title: 'Captioner',
  description: 'Apply beautiful captions to your videos!',
};

const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('captioner-theme');
    var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${bodoni.variable} ${cormorant.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${dmSans.className} page-grain relative`}>
        <ThemeProvider>
          <ChromaBackground />
          <main className="relative z-10 p-4 sm:p-6 max-w-3xl mx-auto min-h-screen">
            <SiteHeader />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
