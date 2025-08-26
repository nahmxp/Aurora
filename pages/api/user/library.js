import connectMongo from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
  try {
    await connectMongo();
    
    const { method } = req;
    const { userId } = req;

    if (method === 'GET') {
      console.log(`Fetching library for user ${userId}`);
      
      // Find all paid orders for the user
      const paidOrders = await Order.find({ 
        userId, 
        status: { $in: ['paid', 'confirmed', 'sent', 'delivered'] }
      }).sort({ orderedAt: -1 });

      if (!paidOrders.length) {
        return res.status(200).json([]);
      }

      // Extract all unique product IDs from paid orders
      const productIds = new Set();
      paidOrders.forEach(order => {
        order.items.forEach(item => {
          productIds.add(item.productId);
        });
      });

      // Fetch full product details for all purchased books
      const purchasedBooks = await Product.find({
        _id: { $in: Array.from(productIds) }
      });

      console.log(`Found ${purchasedBooks.length} purchased books for user`);
      
      return res.status(200).json(purchasedBooks);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User library API error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Wrap with auth middleware
export default requireAuth(handler);
