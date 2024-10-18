import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import theme from '@/styles/theme';

export default function AccountForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        toast.success('Profile updated successfully');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
          style={{ 
            borderColor: theme.colors.textLight,
            focusRingColor: theme.colors.primary,
          }}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium" style={{ color: theme.colors.text }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
          style={{ 
            borderColor: theme.colors.textLight,
            focusRingColor: theme.colors.primary,
          }}
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
          style={{ 
            backgroundColor: theme.colors.primary,
            focusRingColor: theme.colors.primary,
          }}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </form>
  );
}