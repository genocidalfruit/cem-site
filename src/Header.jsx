import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ title, items, width = 'w-48', links = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-1 font-medium hover:text-yellow-500 transition">
        {title}
        <ChevronDown size={16} />
      </button>

      <div
        className={`absolute top-full left-0 mt-2 ${width} bg-white border border-gray-200 rounded-md shadow-lg z-20 transform transition-all duration-300 ease-out ${
          isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
        }`}
      >
        <ul className="py-2 text-sm text-gray-700">
          {items.map((item, idx) => (
            <li key={idx} className="px-4 py-2 hover:bg-yellow-100 cursor-pointer">
              {links ? (
                <a href={item.href} className="block w-full h-full">
                  {item.label}
                </a>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="bg-white drop-shadow-md fixed w-full z-50 top-0 text-gray-800">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <a href="/">
        <img src="src/assets/icon.svg" alt="Logo" className="h-10" />
      </a>

      <nav className="flex gap-8">
        <Dropdown
          title="Home Building Guide"
          items={['Planning', 'Budgeting', 'Execution']}
        />
        <Dropdown
          title="Products"
          items={['Cement', 'Tiles', 'Adhesives']}
        />
        <Dropdown
          title="Tools"
          width="w-52"
          links
          items={[
            { label: 'Cost Calculator', href: '/cost-calculator' },
            { label: 'Store Locator', href: '/store-locator' },
            { label: 'Product Predictor', href: '/product-predictor' },
            { label: 'EMI Calculator', href: '/emi-calculator' },
            { label: 'Tile Calculator', href: '/tile-calculator' }
          ]}
        />
      </nav>
    </div>
  </header>
);

export default Header;
