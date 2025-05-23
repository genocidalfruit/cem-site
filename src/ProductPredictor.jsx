import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Boxes, Tag, SlidersHorizontal, PackageSearch } from 'lucide-react';
 
const products = [
  {
    name: 'JSW Neo Steel TMT Bars',
    description: 'High strength and flexibility steel bars ideal for residential and commercial construction.',
    price: 45000,
    link: '/',
    tags: ['Durable', 'High Strength', 'Eco Friendly'],
    material: 'Steel',
  },
  {
    name: 'JSW Coated Steel Sheets',
    description: 'Zinc and color coated steel sheets perfect for roofing and cladding applications.',
    price: 60000,
    link: '/',
    tags: ['Weather Resistant', 'Aesthetic', 'Eco Friendly'],
    material: 'Steel',
  },
  {
    name: 'JSW Cement (PSC)',
    description: 'Portland Slag Cement known for better durability and long-lasting strength.',
    price: 350,
    link: '/',
    tags: ['Eco Friendly', 'Cost Effective', 'Durable'],
    material: 'Cement',
  },
  {
    name: 'JSW Paints Aura',
    description: 'Eco-conscious water-based paints with low VOC emissions.',
    price: 2500,
    link: '/',
    tags: ['Eco Friendly', 'Low VOC', 'Premium Finish'],
    material: 'Paint',
  },
  {
    name: 'JSW Concreel HD Cement',
    description: 'Specially formulated for high durability construction in aggressive environments.',
    price: 380,
    link: '/',
    tags: ['Durable', 'High Strength', 'Cost Effective'],
    material: 'Cement',
  },
];
 
const getAllTags = () => {
  const tagSet = new Set();
  products.forEach(product => {
    product.tags.forEach(tag => tagSet.add(tag));
  });
  return [...tagSet];
};
 
const getAllMaterials = () => {
  const materials = new Set();
  products.forEach(product => {
    materials.add(product.material);
  });
  return [...materials];
};
 
const ProductPredictor = () => {
  const [budget, setBudget] = useState(60000);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
 
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
 
  const filteredProducts = products.filter(product => {
    const matchesBudget = product.price <= budget;
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every(tag => product.tags.includes(tag));
    const matchesMaterial =
      selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
    return matchesBudget && matchesTags && matchesMaterial;
  });
 
  const allTags = getAllTags();
  const allMaterials = getAllMaterials();
 
  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50"
    style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a9a9a9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '40px 40px',
      }}>
      <Header />
      <div className="flex-grow border border-gray-300/50 rounded-md bg-gray-100/75 mt-28 mx-10 mb-10 shadow-2xl shadow-gray-600/50">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl font-extrabold text-center flex flex-wrap sm:flex-nowrap items-center justify-center gap-x-3 gap-y-2 mb-6 md:mb-10 border-b border-gray-300 pb-6 sm:pb-10 mt-8 px-2">
          <PackageSearch className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-blue-600 relative top-[1px]" />
          <span className="text-center">Product Predictor</span>
        </h1>
        <div className='mx-4 md:mx-15 p-4 md:p-10'>
        <div className="mb-6 md:mb-8">
          <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">
            <SlidersHorizontal className="inline w-4 h-4 md:w-5 md:h-5 mr-1" /> Budget (₹)
          </label>
          <input
            type="range"
            min={100}
            max={100000}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-yellow-500"
          />
          <div className="mt-2 text-center text-base md:text-lg font-semibold">₹{budget.toLocaleString()}</div>
        </div>
 
        <div className="mb-4 md:mb-6">
          <h2 className="text-base md:text-lg font-semibold mb-2"><Tag className="inline w-4 h-4 md:w-5 md:h-5 mr-1" /> Filter by Requirements</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full border font-medium text-xs md:text-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-yellow-400 text-white border-yellow-400'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag.replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
 
        <div className="mb-6 md:mb-10">
          <h2 className="text-base md:text-lg font-semibold mb-2"><Boxes className="inline w-4 h-4 md:w-5 md:h-5 mr-1" /> Filter by Material</h2>
          <div className="flex flex-wrap gap-2">
            {allMaterials.map(material => (
              <button
                key={material}
                className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full border font-medium text-xs md:text-sm ${
                  selectedMaterials.includes(material)
                    ? 'bg-blue-500/80 text-white border-blue-500/80'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => handleMaterialToggle(material)}
              >
                {material.replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div key={index} className="flex flex-col justify-between bg-white p-4 md:p-6 rounded-xl shadow-md">
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{product.description}</p>
                <p className="text-base md:text-lg font-semibold text-yellow-600 mb-2">₹{product.price.toLocaleString()}</p>
 
                <div className="flex flex-wrap gap-1 md:gap-2 mb-2">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 md:py-1 rounded-full"
                    >
                      {tag.replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  ))}
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 md:py-1 rounded-full">
                    {product.material.replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-3 md:pt-4">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold hover:bg-blue-500"
                >
                  View Product
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};
 
export default ProductPredictor;