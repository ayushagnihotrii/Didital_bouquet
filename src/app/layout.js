import './globals.css';

export const metadata = {
  title: 'Digibouquet — Beautiful Flowers Delivered Digitally',
  description: 'Build and send beautiful digital flower bouquets to anyone, anywhere. Pick your flowers, write a heartfelt card, and share the love.',
  keywords: 'digital bouquet, flowers, send flowers online, virtual flowers, digital gift',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Playfair+Display+SC:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-cream text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
