import React, { useState, useEffect } from 'react';
import { Boxes, Tag, SlidersHorizontal, PackageSearch, Filter, X, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

// API configuration - Fixed the URL to include protocol
const API_BASE_URL = 'https://cem-site-api.onrender.com/api';

// API service functions
const apiService = {
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.budget) params.append('budget', filters.budget);
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters.materials && filters.materials.length > 0) {
        filters.materials.forEach(material => params.append('materials', material));
      }
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await fetch(`${API_BASE_URL}/products?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  async getMaterials() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/materials`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }
};

const ProductPredictor = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [budget, setBudget] = useState(60000);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tags and materials in parallel
        const [tagsData, materialsData] = await Promise.all([
          apiService.getTags(),
          apiService.getMaterials()
        ]);

        setAllTags(tagsData);
        setAllMaterials(materialsData);

        // Fetch initial products
        const productsData = await apiService.getProducts({ budget, limit: 20 });
        setProducts(productsData.data.products);
        setPagination(productsData.data.pagination);

      } catch (err) {
        setError('Failed to load data. Please try again.');
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters = {
          budget,
          tags: selectedTags,
          materials: selectedMaterials,
          limit: 20
        };

        const productsData = await apiService.getProducts(filters);
        setProducts(productsData.data.products);
        setPagination(productsData.data.pagination);

      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchFilteredProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [budget, selectedTags, selectedMaterials]);

  // Filter handlers
  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleMaterialToggle = (material) => {
    setSelectedMaterials(prev =>
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedMaterials([]);
    setBudget(60000);
  };

  const activeFiltersCount = selectedTags.length + selectedMaterials.length;

  // Error component
  if (error && !loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      {/* Hero Section */}
      <div className="pt-10 pb-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <PackageSearch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Product Predictor
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect JSW products for your project with our intelligent filtering system
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 pb-12">
        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 mb-8 overflow-hidden">
          {/* Filter Header */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {activeFiltersCount} active
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear all
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-sm font-medium">
                  {filtersExpanded ? 'Hide' : 'Show'} Filters
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className={`p-6 space-y-8 ${filtersExpanded ? 'block' : 'hidden md:block'}`}>
            {/* Budget Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <label className="text-lg font-semibold text-gray-800">Budget</label>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min={100}
                    max={100000}
                    step={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(budget / 100000) * 100}%, #e5e7eb ${(budget / 100000) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹100</span>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-lg">
                    ₹{budget.toLocaleString()}
                  </div>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </div>

            {/* Requirements Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Requirements</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Materials Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Materials</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {allMaterials.map(material => (
                  <button
                    key={material}
                    className={`px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
                      selectedMaterials.includes(material)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    onClick={() => handleMaterialToggle(material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Recommended Products
              <span className="ml-3 text-lg text-gray-500 font-normal">
                ({pagination.totalProducts} found)
              </span>
            </h2>
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="group bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-yellow-600">
                      ₹{product.price.toLocaleString()}
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {product.material}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Modified Button to Link */}
                  {product.url && ( // Only render the link if a URL exists
                    <a
                      href={product.url}
                      target="_blank" // Opens in a new tab
                      rel="noopener noreferrer" // Security best practice for target="_blank"
                      className="w-full block text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      View Product Details
                    </a>
                  )}
                  {!product.url && ( // Show a disabled button or alternative if no URL
                    <button
                      disabled
                      className="w-full bg-gray-400 text-white py-3 px-6 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Details Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Products Found */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <PackageSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading products...</h3>
                <p className="text-gray-600">
                  Please wait while we fetch the latest products for you
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPredictor;