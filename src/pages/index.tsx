import { useSession } from 'next-auth/react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}