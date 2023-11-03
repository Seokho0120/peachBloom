import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { pretendardFont } from '@/utils/fontUtil';
import { Provider } from '@/context/provider';
import AuthSession from '@/context/AuthSession';

export const metadata: Metadata = {
  title: 'Peach Bloom',
  description: 'Peach Bloom 뷰티 쇼핑몰입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' className={`${pretendardFont.variable} font-sans`}>
      <body className='w-full p-4'>
        <AuthSession>
          <Provider>
            <Navbar />
            {children}
            {/* <Footer /> */}
          </Provider>
        </AuthSession>
      </body>
    </html>
  );
}
