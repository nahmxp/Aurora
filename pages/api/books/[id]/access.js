import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Order from '../../../../models/Order';
import { requireAuth } from '../../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get book ID from query
    const { id } = req.query;
    const { userId } = req; // This comes from requireAuth middleware

    if (!id) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    console.log('Checking access for userId:', userId, 'bookId:', id);

    // Find the book
    const book = await Product.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has this book in their library (any paid order)
    console.log('Checking access for userId:', userId, 'bookId:', id);
    
    const order = await Order.findOne({
      userId: userId,
      'items.productId': id,
      status: { $in: ['paid', 'confirmed', 'sent', 'delivered'] }
    });

    console.log('Found order:', order ? 'Yes' : 'No');
    if (order) {
      console.log('Order status:', order.status);
      console.log('Order items:', order.items.map(item => ({ productId: item.productId, name: item.name })));
    }

    // Also check all orders for this user to debug
    const allUserOrders = await Order.find({ userId: userId });
    console.log('All user orders:', allUserOrders.length);
    allUserOrders.forEach((o, i) => {
      console.log(`Order ${i + 1}:`, {
        status: o.status,
        items: o.items.map(item => ({ productId: item.productId, name: item.name }))
      });
    });

    const hasAccess = !!order;

    if (!hasAccess) {
      return res.status(403).json({ 
        message: 'Purchase required to access this book',
        hasAccess: false 
      });
    }

    // Return book data for authorized user
    res.status(200).json({
      hasAccess: true,
      book: {
        _id: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        targetAudience: book.targetAudience,
        ageRange: book.ageRange,
        digitalContent: book.digitalContent,
        category: book.category,
        subcategory: book.subcategory,
        publishedDate: book.publishedDate,
        language: book.language,
        pageCount: book.pageCount,
        isbn: book.isbn
      }
    });

  } catch (error) {
    console.error('Error verifying book access:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export default requireAuth(handler);
