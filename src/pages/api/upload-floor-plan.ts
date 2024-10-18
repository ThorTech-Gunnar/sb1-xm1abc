import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { name, file } = req.body;

    if (!name || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { url } = await put(name, file, { access: 'public' });

      const floorPlan = await prisma.floorPlan.create({
        data: {
          name,
          imageUrl: url,
          userId: session.user.id,
        },
      });

      return res.status(201).json(floorPlan);
    } catch (error) {
      console.error('Error uploading floor plan:', error);
      return res.status(500).json({ error: 'Error uploading floor plan' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}