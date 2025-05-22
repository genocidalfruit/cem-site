import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
const Dropdown = ({
  title,
  items,
  width = 'w-48',
  links = false,
  mobile = false,
  selectedItem,
  onItemSelect,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
 
  const handleMouseEnter = () => {
    if (!mobile) {
      clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };
 
  const handleMouseLeave = () => {
    if (!mobile) {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
    }
  };
 
  const toggleDropdown = () => {
    if (mobile) {
      setIsOpen(!isOpen);
    }
  };
 
  const handleItemClick = (item) => {
    if (onItemSelect) {
      onItemSelect(item);
    }
    setIsOpen(false);
   
    // Navigate if it's a link item
    if (links) {
      const selected = items.find(i => i.label === item);
      if (selected) {
        navigate(selected.href);
      }
    }
  };
 
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <button
        className={`flex items-center gap-2 font-medium transition ${
          mobile ? 'w-full justify-between py-3 px-4' : ''
        } ${
          selectedItem ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
        }`}
        onClick={toggleDropdown}
      >
        {Icon && <Icon size={18} className="text-gray-500" />}
        <span>{title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          } text-gray-500`}
        />
      </button>
 
      <div
        className={`${mobile ? 'relative' : 'absolute top-full left-0 mt-1'} ${width} bg-white border border-gray-100 rounded-lg shadow-lg z-20 transform transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 visible max-h-[500px] overflow-visible'
            : 'opacity-0 scale-95 invisible max-h-0 overflow-hidden'
        } ${mobile ? 'shadow-none border-none mt-1 ml-8' : ''}`}
      >
        <ul className={`py-2 text-sm ${mobile ? 'space-y-1' : ''}`}>
          {items.map((item, idx) => {
            const itemValue = links ? item.label : item;
            const isSelected = selectedItem === itemValue;
           
            return (
              <li
                key={idx}
                className={`px-4 py-2 cursor-pointer transition ${
                  mobile ? 'rounded' : ''
                } ${
                  isSelected
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => handleItemClick(itemValue)}
              >
                {links ? (
                  <a
                    href={item.href}
                    className="block w-full h-full"
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(itemValue);
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  item
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
 
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    'Home Building Guide': null,
    'Products': null,
    'Tools': null,
    'State': null,
    'City': null
  });
  const menuRef = useRef(null);
 
  // Sample data for states and cities
  const states = ['California', 'Texas', 'New York', 'Florida', 'Illinois'];
  const cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego'],
    'Texas': ['Houston', 'Austin', 'Dallas'],
    'New York': ['New York City', 'Buffalo', 'Rochester'],
    'Florida': ['Miami', 'Orlando', 'Tampa'],
    'Illinois': ['Chicago', 'Springfield', 'Peoria']
  };
 
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
 
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  // Disable scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
 
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
 
  const handleItemSelect = (menuTitle, item) => {
    setSelectedItems(prev => ({
      ...prev,
      [menuTitle]: item
    }));
  };
 
  return (
    <header className="bg-white border-b border-gray-100 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <a href="/" className="z-50">
          <img src="src/assets/icon.svg" alt="Logo" className="h-10" />
        </a>
 
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Dropdown
            title="Home Building Guide"
            items={['Planning', 'Budgeting', 'Execution']}
            selectedItem={selectedItems['Home Building Guide']}
            onItemSelect={(item) => handleItemSelect('Home Building Guide', item)}
          />
          <Dropdown
            title="Products"
            items={['Cement', 'Tiles', 'Adhesives']}
            selectedItem={selectedItems['Products']}
            onItemSelect={(item) => handleItemSelect('Products', item)}
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
            selectedItem={selectedItems['Tools']}
            onItemSelect={(item) => handleItemSelect('Tools', item)}
          />
        </nav>
 
        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden z-50 p-2 rounded-md focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700 transition-transform duration-300 rotate-180" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 transition-transform duration-300" />
          )}
        </button>
 
        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-all duration-500 ease-in-out ${
            isMenuOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          } md:hidden`}
        >
          <div className="flex flex-col space-y-4">
            <Dropdown
              title="Home Building Guide"
              items={['Planning', 'Budgeting', 'Execution']}
              mobile={true}
              selectedItem={selectedItems['Home Building Guide']}
              onItemSelect={(item) => handleItemSelect('Home Building Guide', item)}
            />
            <Dropdown
              title="Products"
              items={['Cement', 'Tiles', 'Adhesives']}
              mobile={true}
              selectedItem={selectedItems['Products']}
              onItemSelect={(item) => handleItemSelect('Products', item)}
            />
            <Dropdown
              title="Tools"
              width="w-full"
              links
              mobile={true}
              items={[
                { label: 'Cost Calculator', href: '/cost-calculator' },
                { label: 'Store Locator', href: '/store-locator' },
                { label: 'Product Predictor', href: '/product-predictor' },
                { label: 'EMI Calculator', href: '/emi-calculator' },
                { label: 'Tile Calculator', href: '/tile-calculator' }
              ]}
              selectedItem={selectedItems['Tools']}
              onItemSelect={(item) => handleItemSelect('Tools', item)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
 
export default Header;