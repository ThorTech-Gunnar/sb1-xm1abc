import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const LicenseCheck: React.FC = () => {
  const [licenseStatus, setLicenseStatus] = useState<{ isValid: boolean; message: string } | null>(null);
  const [licenseKey, setLicenseKey] = useState('');
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    if (user?.licenseKey) {
      try {
        const response = await api.post('/license/validate', { licenseKey: user.licenseKey });
        setLicenseStatus({
          isValid: response.data.isValid,
          message: response.data.isValid ? 'Licensed version' : 'Invalid license'
        });
      } catch (error) {
        console.error('Error validating license:', error);
        setLicenseStatus({ isValid: false, message: 'Error checking license' });
      }
    } else if (!user?.isTrialExpired) {
      setLicenseStatus({ isValid: true, message: 'Trial version' });
    } else {
      setLicenseStatus({ isValid: false, message: 'Trial expired' });
    }
  };

  const handleActivateLicense = async () => {
    try {
      const response = await api.post('/license/validate', { licenseKey });
      if (response.data.isValid) {
        updateUser({ ...user, licenseKey, isTrialExpired: false });
        addNotification('License activated successfully', 'success');
        checkLicense();
      } else {
        addNotification('Invalid license key', 'error');
      }
    } catch (error) {
      console.error('Error activating license:', error);
      addNotification('Error activating license', 'error');
    }
  };

  if (!licenseStatus) {
    return <div>Checking license...</div>;
  }

  if (licenseStatus.isValid) {
    return <div>{licenseStatus.message}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <p className="mb-4 text-red-500">{licenseStatus.message}</p>
      <input
        type="text"
        value={licenseKey}
        onChange={(e) => setLicenseKey(e.target.value)}
        placeholder="Enter license key"
        className="w-full px-3 py-2 mb-4 border rounded"
      />
      <button
        onClick={handleActivateLicense}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Activate License
      </button>
    </div>
  );
};

export default LicenseCheck;