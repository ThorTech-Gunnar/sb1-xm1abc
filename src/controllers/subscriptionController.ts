import { Request, Response } from 'express';
import Stripe from 'stripe';
import { User } from '../utils/dbSchema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' });

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create or retrieve Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: planId }],
      expand: ['latest_invoice.payment_intent'],
    });

    user.subscriptionId = subscription.id;
    user.subscriptionStatus = subscription.status;
    await user.save();

    res.json({ subscriptionId: subscription.id, status: subscription.status });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Error creating subscription' });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { newPlanId } = req.body;
    const user = await User.findById(req.userId);

    if (!user || !user.subscriptionId) {
      return res.status(404).json({ message: 'User or subscription not found' });
    }

    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
    await stripe.subscriptions.update(user.subscriptionId, {
      items: [{ id: subscription.items.data[0].id, price: newPlanId }],
    });

    user.subscriptionStatus = subscription.status;
    await user.save();

    res.json({ status: subscription.status });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription' });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.subscriptionId) {
      return res.status(404).json({ message: 'User or subscription not found' });
    }

    const canceledSubscription = await stripe.subscriptions.del(user.subscriptionId);

    user.subscriptionId = undefined;
    user.subscriptionStatus = 'canceled';
    await user.save();

    res.json({ status: canceledSubscription.status });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Error canceling subscription' });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ status: user.subscriptionStatus });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ message: 'Error getting subscription status' });
  }
};