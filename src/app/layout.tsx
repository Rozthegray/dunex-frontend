import './globals.css';

export const metadata = {
  title: 'Dunex Markets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#05050a] text-white min-h-screen">
        {/* Removed AuthGuard from here! */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}