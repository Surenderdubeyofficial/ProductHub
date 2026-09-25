import { redirect } from 'next/navigation';

/**
 * Root Route Redirector
 * Directs visitors to /login by default on the server level.
 * If the user is already authenticated, the client-side login page
 * will immediately transition them into /products.
 */
export default function RootPage() {
  redirect('/login');
}
