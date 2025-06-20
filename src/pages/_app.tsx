import { AppProps } from 'next/app';
import { WatchlistProvider } from '../context/WatchlistContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { UserSettingsProvider } from '../context/UserSettingsContext';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </AuthProvider>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <UserSettingsProvider userId={user?.uid}>
      <WatchlistProvider>
        {children}
      </WatchlistProvider>
    </UserSettingsProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp; 