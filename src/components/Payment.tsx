import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface PaymentProps {
  planId: string;
  amount: number;
}

const Payment: React.FC<PaymentProps> = ({ planId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      const response = await api.post('/subscriptions/create', {
        planId,
        paymentMethodId: paymentMethod.id,
      });

      if (response.data.status === 'active') {
        updateUser({ ...user, subscriptionStatus: 'active' });
        addNotification('Subscription activated successfully', 'success');
      } else {
        addNotification('Subscription created but requires additional action', 'warning');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      addNotification('Error processing payment. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default Payment;