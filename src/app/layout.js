import { Bodoni_Moda, DM_Sans } from 'next/font/google';
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

export const metadata = {
  title: 'Captioner',
  description: 'Apply beautiful captions to your videos!',
};

const themeInitScript = `
(function(){
  var stored;
  try { stored = localStorage.getItem('captioner-theme'); } catch (e) {}
  try {
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
      className={`${dmSans.variable} ${bodoni.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${dmSans.className} relative`}>
        <ThemeProvider>
          <ChromaBackground />
          <main className="relative z-10 px-5 py-5 sm:px-8 sm:py-7 max-w-6xl mx-auto min-h-screen">
            <SiteHeader />
            {children}
            <footer className="site-footer">
              <span>Captioner <span aria-hidden="true">/</span> A little more understood.</span>
              <a href="mailto:aryagsv@gmail.com">Say hello ↗</a>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
