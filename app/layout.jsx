import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata = {
  title: 'NexusAdmin | Product Management Dashboard',
  description: 'Production-quality SaaS Product Admin Dashboard built with Next.js and JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
