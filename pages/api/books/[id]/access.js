import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';
import Order from '../../../models/Order';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get book ID from query
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find the book
    const book = await Product.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user has purchased this book
    const order = await Order.findOne({
      user: userId,
      'items.product': id,
      paymentStatus: 'completed'
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
