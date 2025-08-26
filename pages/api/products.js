import connectMongo from '../../lib/mongodb';
import Product from '../../models/Product';
import checkAdminAuth from '../../lib/checkAdminAuth';

export default async function handler(req, res) {
  try {
    await connectMongo();
    const { method } = req;

    if (method === 'GET') {
      // Check if there's a search query
      const { search } = req.query;
      
      if (search && search.trim()) {
        // Create a case-insensitive search query for multiple fields
        // Support both legacy and new field names
        const searchQuery = {
          $or: [
            { name: { $regex: search, $options: 'i' } },        // Legacy
            { title: { $regex: search, $options: 'i' } },       // New
            { brand: { $regex: search, $options: 'i' } },       // Legacy  
            { author: { $regex: search, $options: 'i' } },      // New
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { publisher: { $regex: search, $options: 'i' } }    // New
          ]
        };
        
        let products = await Product.find(searchQuery);
        
        // Transform products to include legacy field mappings for backward compatibility
        products = products.map(product => {
          const productObj = product.toObject();
          return {
            ...productObj,
            // Legacy field mappings
            name: productObj.title || productObj.name,
            brand: productObj.author || productObj.brand, 
            image: productObj.coverImage || productObj.image
          };
        });
        
        return res.status(200).json(products);
      }
      
      // Regular product listing without search
      let products = await Product.find({});
      
      // Transform products to include legacy field mappings for backward compatibility
      products = products.map(product => {
        const productObj = product.toObject();
        return {
          ...productObj,
          // Legacy field mappings
          name: productObj.title || productObj.name,
          brand: productObj.author || productObj.brand,
          image: productObj.coverImage || productObj.image
        };
      });
      res.status(200).json(products);
    }

    else if (method === 'POST') {
      // Check admin authorization
      const authCheck = await checkAdminAuth(req);
      if (!authCheck.success) {
        return res.status(authCheck.status).json({ error: authCheck.message });
      }
      
      try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message });
      }
    }

    else if (method === 'PUT') {
      // Check admin authorization
      const authCheck = await checkAdminAuth(req);
      if (!authCheck.success) {
        return res.status(authCheck.status).json({ error: authCheck.message });
      }
      
      try {
        const { id, ...rest } = req.body;
        const updated = await Product.findByIdAndUpdate(id, rest, { new: true });
        res.status(200).json(updated);
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
      }
    }

    else if (method === 'DELETE') {
      // Check admin authorization
      const authCheck = await checkAdminAuth(req);
      if (!authCheck.success) {
        return res.status(authCheck.status).json({ error: authCheck.message });
      }
      
      try {
        const { id } = req.body;
        await Product.findByIdAndDelete(id);
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
      }
    }
    
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ error: 'Error connecting to database', details: error.message });
  }
}
