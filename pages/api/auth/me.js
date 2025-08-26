import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { getTokenFromRequest, verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

  // Get token from request
  const token = await getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  await dbConnect();

  // Find user by ID
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Return user data
  return res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin
    }
  });
} 