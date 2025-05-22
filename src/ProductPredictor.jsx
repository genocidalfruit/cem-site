import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Boxes, Tag, SlidersHorizontal } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
      <Header />
      <div className="flex-grow mx-15 p-10 mt-24 border border-gray-300/50 rounded-md bg-gray-100/20 drop-shadow-xs mb-10">
        <h1 className="text-5xl font-extrabold text-center mb-10 mt-4">Product Predictor</h1>

        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            <SlidersHorizontal className="inline w-5 h-5 mr-1" /> Budget (₹)
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
          <div className="mt-2 text-center text-lg font-semibold">₹{budget.toLocaleString()}</div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2"><Tag className="inline w-5 h-5 mr-1" /> Filter by Requirements</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full border font-medium text-sm ${
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

        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-2"><Boxes className="inline w-5 h-5 mr-1" /> Filter by Material</h2>
          <div className="flex flex-wrap gap-2">
            {allMaterials.map(material => (
              <button
                key={material}
                className={`px-3 py-1 rounded-full border font-medium text-sm ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={index} className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-md">
              <div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-lg font-semibold text-yellow-600 mb-2">₹{product.price.toLocaleString()}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {tag.replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  ))}
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {product.material.replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-500"
                >
                  View Product
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPredictor;
