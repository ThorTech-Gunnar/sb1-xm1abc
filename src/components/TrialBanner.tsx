import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const TrialBanner: React.FC = () => {
  const { user } = useAuth();

  if (!user || !user.trialEndDate) return null;

  const daysLeft = Math.max(0, Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-blue-500 text-white py-2 px-4 text-center">
      {daysLeft > 0 ? (
        <p>Your free trial ends in {daysLeft} days. <a href="/subscribe" className="underline">Subscribe now</a> to continue using the application.</p>
      ) : (
        <p>Your free trial has ended. <a href="/subscribe" className="underline">Subscribe now</a> to continue using the application.</p>
      )}
    </div>
  );
};

export default TrialBanner;