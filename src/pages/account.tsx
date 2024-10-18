import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import AccountForm from '@/components/AccountForm';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Access denied</div>;
  }

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Account</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <AccountForm user={session.user} />
          </div>
        </main>
      </div>
    </Layout>
  );
}