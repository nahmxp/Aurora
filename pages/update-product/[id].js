
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// List of book categories organized by target audience
const CATEGORIES = [
  // Kids Section
  "Kids - Picture Books",
  "Kids - Early Readers", 
  "Kids - Middle Grade",
  "Kids - Young Adult",
  "Kids - Educational",
  "Kids - Activity Books",
  // Adults Section
  "Adults - Fiction",
  "Adults - Non-Fiction",
  "Adults - Biography",
  "Adults - Self-Help",
  "Adults - Romance",
  "Adults - Mystery/Thriller",
  "Adults - Science Fiction",
  "Adults - Fantasy",
  "Adults - History",
  "Adults - Health & Wellness",
  "Adults - Business",
  "Adults - Travel",
  // Higher Education Section
  "Higher Education - Textbooks",
  "Higher Education - Academic Journals",
  "Higher Education - Research Papers",
  "Higher Education - Reference Books",
  "Higher Education - Scientific Studies",
  "Higher Education - Technical Manuals",
  "Higher Education - Thesis/Dissertations"
];

export default function UpdateProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/product/${id}`);
          if (!res.ok) {
            alert('Book not found');
            router.push('/');
            return;
          }
          const product = await res.json();
          setForm({
            ...product,
            ageRange: product.ageRange || { min: '', max: '' },
            format: product.format || ['digital'],
            isFree: product.isFree || false,
            digitalContent: {
              hasContent: product.digitalContent?.hasContent || false,
              contentType: product.digitalContent?.contentType || 'pdf',
              contentUrl: product.digitalContent?.contentUrl || '',
              fileName: product.digitalContent?.fileName || '',
              doiNumber: product.digitalContent?.doiNumber || '',
              externalLink: product.digitalContent?.externalLink || '',
              linkDescription: product.digitalContent?.linkDescription || ''
            },
            isRentable: product.isRentable || false,
            rentalPrice: {
              hourly: product.rentalPrice?.hourly || '',
              daily: product.rentalPrice?.daily || ''
            }
          });
        } catch (error) {
          console.error('Failed to fetch book', error);
          alert('Failed to load book data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, router]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Book title is required';
    if (!form.author) newErrors.author = 'Author is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.targetAudience) newErrors.targetAudience = 'Target audience is required';
    if (!form.isFree) {
      if (!form.price) newErrors.price = 'Price is required for paid books';
      else if (isNaN(form.price) || parseFloat(form.price) <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }
    if (form.targetAudience === 'kids') {
      if (!form.ageRange.min) newErrors.ageRangeMin = 'Minimum age is required for kids books';
      if (!form.ageRange.max) newErrors.ageRangeMax = 'Maximum age is required for kids books';
      if (form.ageRange.min && form.ageRange.max && parseInt(form.ageRange.min) > parseInt(form.ageRange.max)) {
        newErrors.ageRange = 'Minimum age cannot be greater than maximum age';
      }
    }
    if (form.digitalContent?.hasContent) {
      if (form.digitalContent.contentType === 'doi' && !form.digitalContent.doiNumber) {
        newErrors.doiNumber = 'DOI number is required when content type is DOI';
      }
      if ((form.digitalContent.contentType === 'link' || form.digitalContent.contentType === 'external') && !form.digitalContent.externalLink) {
        newErrors.externalLink = 'External link is required when content type is link or external';
      }
      if ([ 'pdf', 'doc', 'docx', 'epub', 'txt' ].includes(form.digitalContent.contentType) && !form.digitalContent.contentUrl) {
        newErrors.contentUrl = 'Content URL is required for document uploads';
      }
    }
    if (form.pageCount && (isNaN(form.pageCount) || parseInt(form.pageCount) <= 0)) {
      newErrors.pageCount = 'Page count must be a positive number';
    }
    if (form.isRentable) {
      if (!form.rentalPrice.hourly && !form.rentalPrice.daily) {
        newErrors.rentalPrice = 'At least one rental price (hourly or daily) is required';
      } else {
        if (form.rentalPrice.hourly && (isNaN(form.rentalPrice.hourly) || parseFloat(form.rentalPrice.hourly) <= 0)) {
          newErrors.rentalPriceHourly = 'Hourly rental price must be a positive number';
        }
        if (form.rentalPrice.daily && (isNaN(form.rentalPrice.daily) || parseFloat(form.rentalPrice.daily) <= 0)) {
          newErrors.rentalPriceDaily = 'Daily rental price must be a positive number';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('digitalContent.')) {
      const [, field] = name.split('.');
      setForm({
        ...form,
        digitalContent: {
          ...form.digitalContent,
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else if (type === 'checkbox') {
      setForm({
        ...form,
        [name]: checked,
      });
    } else if (name.startsWith('rentalPrice.')) {
      const [, field] = name.split('.');
      setForm({
        ...form,
        rentalPrice: {
          ...form.rentalPrice,
          [field]: value
        }
      });
    } else if (name.startsWith('ageRange.')) {
      const [, field] = name.split('.');
      setForm({
        ...form,
        ageRange: {
          ...form.ageRange,
          [field]: value
        }
      });
    } else if (name === 'format') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setForm({
        ...form,
        [name]: selectedOptions
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      const bookData = {
        ...form,
        price: form.isFree ? 0 : parseFloat(form.price),
        pageCount: form.pageCount ? parseInt(form.pageCount) : undefined,
        publishedDate: form.publishedDate ? new Date(form.publishedDate) : undefined,
        ageRange: form.targetAudience === 'kids' ? {
          min: parseInt(form.ageRange.min),
          max: parseInt(form.ageRange.max)
        } : undefined,
        digitalContent: {
          ...form.digitalContent,
          hasContent: form.digitalContent.hasContent
        },
        rentalPrice: {
          hourly: form.rentalPrice.hourly ? parseFloat(form.rentalPrice.hourly) : 0,
          daily: form.rentalPrice.daily ? parseFloat(form.rentalPrice.daily) : 0
        },
        coverImage: form.coverImage || 'https://via.placeholder.com/400?text=No+Cover+Image',
      };
      const res = await fetch(`/api/product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        router.push(`/product/${id}`);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      setApiError(error.message || 'Failed to update book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading book data...</p>
    </div>
  );
  if (!form) return (
    <div className="empty-state">
      <h3>Book not found</h3>
      <p>The book you are looking for does not exist or has been removed.</p>
      <button onClick={() => router.push('/')} className="btn-primary">
        Return to Dashboard
      </button>
    </div>
  );

  return (
    <div className="form-container">
      <h1>Update Book</h1>
      {apiError && (
        <div className="error-message">{apiError}</div>
      )}
      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Book Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="title">Book Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter book title"
              value={form.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              id="author"
              name="author"
              type="text"
              placeholder="Enter author name"
              value={form.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
            />
            {errors.author && <p className="error">{errors.author}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                id="isbn"
                name="isbn"
                type="text"
                placeholder="Enter ISBN"
                value={form.isbn}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="publisher">Publisher</label>
              <input
                id="publisher"
                name="publisher"
                type="text"
                placeholder="Enter publisher name"
                value={form.publisher}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="publishedDate">Published Date</label>
              <input
                id="publishedDate"
                name="publishedDate"
                type="date"
                value={form.publishedDate || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pageCount">Page Count</label>
              <input
                id="pageCount"
                name="pageCount"
                type="number"
                placeholder="Enter page count"
                value={form.pageCount}
                onChange={handleChange}
                className={errors.pageCount ? 'error' : ''}
              />
              {errors.pageCount && <p className="error">{errors.pageCount}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={form.language}
                onChange={handleChange}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`category-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="error">{errors.category}</p>}
            </div>
          </div>
        </div>
        {/* Target Audience */}
        <div className="form-section">
          <h3>Target Audience</h3>
          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience *</label>
            <select
              id="targetAudience"
              name="targetAudience"
              value={form.targetAudience}
              onChange={handleChange}
              className={errors.targetAudience ? 'error' : ''}
            >
              <option value="">Select target audience</option>
              <option value="kids">Kids</option>
              <option value="adults">Adults</option>
              <option value="higher-education">Higher Education</option>
            </select>
            {errors.targetAudience && <p className="error">{errors.targetAudience}</p>}
          </div>
          {form.targetAudience === 'kids' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ageRange.min">Minimum Age *</label>
                <input
                  id="ageRange.min"
                  name="ageRange.min"
                  type="number"
                  min="0"
                  max="18"
                  placeholder="Min age"
                  value={form.ageRange.min}
                  onChange={handleChange}
                  className={errors.ageRangeMin ? 'error' : ''}
                />
                {errors.ageRangeMin && <p className="error">{errors.ageRangeMin}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="ageRange.max">Maximum Age *</label>
                <input
                  id="ageRange.max"
                  name="ageRange.max"
                  type="number"
                  min="0"
                  max="18"
                  placeholder="Max age"
                  value={form.ageRange.max}
                  onChange={handleChange}
                  className={errors.ageRangeMax ? 'error' : ''}
                />
                {errors.ageRangeMax && <p className="error">{errors.ageRangeMax}</p>}
              </div>
            </div>
          )}
          {errors.ageRange && <p className="error">{errors.ageRange}</p>}
        </div>
        {/* Pricing */}
        <div className="form-section">
          <h3>Pricing</h3>
          <div className="form-group">
            <label htmlFor="isFree" className="checkbox-label">
              <input
                id="isFree"
                name="isFree"
                type="checkbox"
                checked={form.isFree}
                onChange={handleChange}
              />
              <span>This book is free</span>
            </label>
          </div>
          {!form.isFree && (
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={form.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <p className="error">{errors.price}</p>}
            </div>
          )}
        </div>
        {/* Format */}
        <div className="form-section">
          <h3>Format</h3>
          <div className="form-group">
            <label htmlFor="format">Available Formats</label>
            <select
              id="format"
              name="format"
              multiple
              value={form.format}
              onChange={handleChange}
              style={{ height: '80px' }}
            >
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
            </select>
            <small>Hold Ctrl/Cmd to select multiple formats</small>
          </div>
        </div>
        {/* Digital Content */}
        <div className="form-section">
          <h3>Digital Content</h3>
          <div className="form-group">
            <label htmlFor="digitalContent.hasContent" className="checkbox-label">
              <input
                id="digitalContent.hasContent"
                name="digitalContent.hasContent"
                type="checkbox"
                checked={form.digitalContent.hasContent}
                onChange={handleChange}
              />
              <span>This book has digital content</span>
            </label>
          </div>
          {form.digitalContent.hasContent && (
            <div className="digital-content-section">
              <div className="form-group">
                <label htmlFor="digitalContent.contentType">Content Type</label>
                <select
                  id="digitalContent.contentType"
                  name="digitalContent.contentType"
                  value={form.digitalContent.contentType}
                  onChange={handleChange}
                >
                  <option value="pdf">PDF Document</option>
                  <option value="doc">Word Document (.doc)</option>
                  <option value="docx">Word Document (.docx)</option>
                  <option value="epub">EPUB</option>
                  <option value="txt">Text File</option>
                  <option value="link">External Link</option>
                  <option value="doi">DOI (Academic Paper)</option>
                  <option value="external">External Resource</option>
                </select>
              </div>
              {[ 'pdf', 'doc', 'docx', 'epub', 'txt' ].includes(form.digitalContent.contentType) && (
                <>
                  <div className="form-group">
                    <label htmlFor="digitalContent.contentUrl">Document URL *</label>
                    <input
                      id="digitalContent.contentUrl"
                      name="digitalContent.contentUrl"
                      type="url"
                      placeholder="Enter document URL"
                      value={form.digitalContent.contentUrl}
                      onChange={handleChange}
                      className={errors.contentUrl ? 'error' : ''}
                    />
                    {errors.contentUrl && <p className="error">{errors.contentUrl}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="digitalContent.fileName">File Name</label>
                    <input
                      id="digitalContent.fileName"
                      name="digitalContent.fileName"
                      type="text"
                      placeholder="Enter file name"
                      value={form.digitalContent.fileName}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              {form.digitalContent.contentType === 'doi' && (
                <div className="form-group">
                  <label htmlFor="digitalContent.doiNumber">DOI Number *</label>
                  <input
                    id="digitalContent.doiNumber"
                    name="digitalContent.doiNumber"
                    type="text"
                    placeholder="Enter DOI (e.g., 10.1000/182)"
                    value={form.digitalContent.doiNumber}
                    onChange={handleChange}
                    className={errors.doiNumber ? 'error' : ''}
                  />
                  {errors.doiNumber && <p className="error">{errors.doiNumber}</p>}
                </div>
              )}
              {(form.digitalContent.contentType === 'link' || form.digitalContent.contentType === 'external') && (
                <>
                  <div className="form-group">
                    <label htmlFor="digitalContent.externalLink">External Link *</label>
                    <input
                      id="digitalContent.externalLink"
                      name="digitalContent.externalLink"
                      type="url"
                      placeholder="Enter external link URL"
                      value={form.digitalContent.externalLink}
                      onChange={handleChange}
                      className={errors.externalLink ? 'error' : ''}
                    />
                    {errors.externalLink && <p className="error">{errors.externalLink}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="digitalContent.linkDescription">Link Description</label>
                    <input
                      id="digitalContent.linkDescription"
                      name="digitalContent.linkDescription"
                      type="text"
                      placeholder="Describe what this link contains"
                      value={form.digitalContent.linkDescription}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* Images */}
        <div className="form-section">
          <h3>Images</h3>
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              placeholder="Enter cover image URL (optional)"
              value={form.coverImage}
              onChange={handleChange}
            />
            <small>Leave blank to use a placeholder image</small>
          </div>
        </div>
        {/* Description */}
        <div className="form-section">
          <h3>Description</h3>
          <div className="form-group">
            <label htmlFor="description">Book Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter book description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <p className="error">{errors.description}</p>}
          </div>
        </div>
        {/* Legacy Rental Section (Hidden but kept for compatibility) */}
        <div className="rental-section form-group" style={{ display: 'none' }}>
          <div className="rental-toggle">
            <label htmlFor="isRentable" className="checkbox-label">
              <input
                id="isRentable"
                name="isRentable"
                type="checkbox"
                checked={form.isRentable}
                onChange={handleChange}
              />
              <span>Available for Rent</span>
            </label>
          </div>
          {form.isRentable && (
            <div className="rental-prices">
              <h3>Rental Options</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rentalPrice.hourly">Hourly Rate ($)</label>
                  <input
                    id="rentalPrice.hourly"
                    name="rentalPrice.hourly"
                    type="number"
                    step="0.01"
                    placeholder="Enter hourly rate"
                    value={form.rentalPrice.hourly}
                    onChange={handleChange}
                    className={errors.rentalPriceHourly ? 'error' : ''}
                  />
                  {errors.rentalPriceHourly && <p className="error">{errors.rentalPriceHourly}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="rentalPrice.daily">Daily Rate ($)</label>
                  <input
                    id="rentalPrice.daily"
                    name="rentalPrice.daily"
                    type="number"
                    step="0.01"
                    placeholder="Enter daily rate"
                    value={form.rentalPrice.daily}
                    onChange={handleChange}
                    className={errors.rentalPriceDaily ? 'error' : ''}
                  />
                  {errors.rentalPriceDaily && <p className="error">{errors.rentalPriceDaily}</p>}
                </div>
              </div>
              {errors.rentalPrice && <p className="error">{errors.rentalPrice}</p>}
            </div>
          )}
        </div>
        <div className="form-actions">
          <button type="button" className="btn-outline" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Book'}
          </button>
        </div>
      </form>
      <style jsx>{`
        .product-form {
          background-color: var(--card-bg);
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px var(--shadow-color);
          max-width: 800px;
          margin: 0 auto;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: var(--text-color);
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
          outline: none;
        }
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: var(--danger-color);
        }
        .form-group small {
          display: block;
          margin-top: 5px;
          font-size: 0.85em;
          color: #666;
        }
        .error {
          color: var(--danger-color);
          font-size: 0.85em;
          margin-top: 5px;
        }
        .form-actions {
          margin-top: 30px;
          display: flex;
          gap: 15px;
          justify-content: flex-end;
        }
        .form-actions .btn-primary,
        .form-actions .btn-outline {
          font-size: 16px;
          padding: 10px 24px;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .checkbox-label input {
          margin-right: 8px;
          width: auto;
        }
        .digital-content-section {
          background-color: rgba(var(--accent-rgb), 0.05);
          padding: 15px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
        }
        .rental-section {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 20px;
          background-color: rgba(var(--accent-rgb), 0.05);
        }
        .rental-prices {
          margin-top: 20px;
        }
        .rental-prices h3 {
          font-size: 16px;
          margin-bottom: 15px;
          color: var(--secondary-color);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 576px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .product-form {
            padding: 16px;
          }
          .form-actions {
            flex-direction: column;
            gap: 10px;
          }
          .form-actions button {
            width: 100%;
          }
        }
        .empty-state {
          text-align: center;
          padding: 50px 20px;
          max-width: 600px;
          margin: 40px auto;
          background-color: var(--card-bg);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }
      `}</style>
    </div>
  );
}
