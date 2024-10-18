import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { getCachedData, setCachedData } from '@/lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const cacheKey = `cases_${session.user.id}`;
    const cachedCases = await getCachedData(cacheKey);

    if (cachedCases) {
      return res.status(200).json(cachedCases);
    }

    const cases = await prisma.case.findMany({
      where: {
        userId: session.user.id,
      },
    });

    await setCachedData(cacheKey, cases, 300); // Cache for 5 minutes

    return res.status(200).json(cases);
  } else if (req.method === 'POST') {
    const { title, description } = req.body;

    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
    });

    return res.status(201).json(newCase);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}