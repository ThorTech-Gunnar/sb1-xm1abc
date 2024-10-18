import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Payment from './Payment';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Choose Your Subscription</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic Plan</h2>
          <p className="text-gray-600 mb-4">Perfect for small businesses</p>
          <ul className="mb-6">
            <li>Up to 5 users</li>
            <li>Basic reporting</li>
            <li>1 GB storage</li>
          </ul>
          <p className="text-2xl font-bold mb-4">$9.99/month</p>
          <Payment planId="basic" amount={9.99} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pro Plan</h2>
          <p className="text-gray-600 mb-4">For growing businesses</p>
          <ul className="mb-6">
            <li>Up to 20 users</li>
            <li>Advanced reporting</li>
            <li>5 GB storage</li>
          </ul>
          <p className="text-2xl font-bold mb-4">$29.99/month</p>
          <Payment planId="pro" amount={29.99} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enterprise Plan</h2>
          <p className="text-gray-600 mb-4">For large organizations</p>
          <ul className="mb-6">
            <li>Unlimited users</li>
            <li>Custom reporting</li>
            <li>Unlimited storage</li>
          </ul>
          <p className="text-2xl font-bold mb-4">$99.99/month</p>
          <Payment planId="enterprise" amount={99.99} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;