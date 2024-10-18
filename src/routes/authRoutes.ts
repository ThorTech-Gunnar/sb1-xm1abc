import express from 'express';
import { User } from '../utils/dbSchema';
import { comparePassword, createToken, checkTrialStatus } from '../utils/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isTrialExpired = user.checkTrialStatus();
    const token = createToken(user);

    res.json({ token, user: { id: user._id, email: user.email, role: user.role, isTrialExpired } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// ... (keep other existing routes)

export default router;