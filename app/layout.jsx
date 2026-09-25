import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata = {
  title: 'ProductHub — Product Management System',
  description: 'Production-grade product administration dashboard built with Next.js and JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
