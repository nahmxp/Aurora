import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  // Basic product info (converted to book info)
  title: String,           // Renamed from 'name'
  author: String,          // Renamed from 'brand' 
  price: Number,
  description: String,
  coverImage: String,      // Renamed from 'image'
  category: String,
  
  // Book-specific metadata
  isbn: String,
  publisher: String,
  publishedDate: Date,
  pageCount: Number,
  language: {
    type: String,
    default: 'English'
  },
  
  // Digital content and links
  digitalContent: {
    hasContent: {
      type: Boolean,
      default: false
    },
    contentType: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'epub', 'txt', 'link', 'doi', 'external'],
      default: 'pdf'
    },
    contentUrl: String,      // File URL or external link
    fileName: String,        // Original file name
    fileSize: Number,        // File size in bytes
    doiNumber: String,       // For academic papers
    externalLink: String,    // For external resources
    linkDescription: String  // Description of what the link contains
  },
  
  // Target audience and age appropriateness
  targetAudience: {
    type: String,
    enum: ['kids', 'adults', 'higher-education'],
    required: true
  },
  
  // Age range for kids books
  ageRange: {
    min: {
      type: Number,
      min: 0,
      max: 18
    },
    max: {
      type: Number,
      min: 0,
      max: 18
    }
  },
  
  // Format availability
  format: [{
    type: String,
    enum: ['digital', 'physical'],
    default: 'digital'
  }],
  
  // Free vs paid content
  isFree: {
    type: Boolean,
    default: false
  },
  
  // Legacy rental fields (keeping for backward compatibility, but not used for books)
  isRentable: {
    type: Boolean,
    default: false
  },
  rentalPrice: {
    hourly: {
      type: Number,
      default: 0
    },
    daily: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
