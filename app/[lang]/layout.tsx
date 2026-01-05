import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '../_providers/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Guesspy',
  description: 'There are spies within us',
  keywords: [
    'spy',
    'guessing game',
    'multiplayer',
    'fun',
    'social deduction',
    'word games',
    'party games',
    'friends',
    'family',
    'online gaming',
    'interactive',
    'strategy',
    'team play',
    'entertainment',
    'casual gaming',
  ],
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
