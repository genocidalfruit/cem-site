import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import LoginModal from './LoginModal.jsx';
import SignupModal from './SignupModal.jsx';
import { Toaster } from 'react-hot-toast';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Utility to set a cookie
  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  // Utility to get a cookie
  const getCookie = (name) => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  };

  // Utility to remove a cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  };

  // Restore login state from cookie if available
  useEffect(() => {
    const token = getCookie('session_token');
    const storedUser = getCookie('user_data');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(storedUser));
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Failed to parse user data from cookie.');
      }
    }
  }, []);

  // Handle login and store token
  const handleLoginSuccess = (apiResponse) => {
    setIsLoggedIn(true);
    const userData = {
      firstName: apiResponse.user.firstName,
      lastName: apiResponse.user.lastName,
      email: apiResponse.user.email
    };
    setUser(userData);
    setShowLoginModal(false);

    // Store token and user data in cookies (for 7 days)
    setCookie('session_token', apiResponse.token, 7);
    setCookie('user_data', JSON.stringify(userData), 7);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ firstName: '', lastName: '', email: '' });
    deleteCookie('session_token');
    deleteCookie('user_data');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-slate-50 to-gray-50 border-b-2 border-yellow-500/20 px-8 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <a href="/" className="z-50 group transition-transform duration-300 hover:scale-105">
          <svg 
            width="59" 
            height="36" 
            viewBox="0 0 59 36" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 group-hover:drop-shadow-md"
          >
            <path d="M20.0898 18C20.0898 19.1046 19.1944 20 18.0898 20C16.9853 20 16.0898 19.1046 16.0898 18C16.0898 16.8954 16.9853 16 18.0898 16C19.1944 16 20.0898 16.8954 20.0898 18Z" fill="currentColor" className="text-gray-800 group-hover:text-yellow-500 transition-colors duration-300"></path>
            <path d="M42.0898 18C42.0898 19.1046 41.1944 20 40.0898 20C38.9853 20 38.0898 19.1046 38.0898 18C38.0898 16.8954 38.9853 16 40.0898 16C41.1944 16 42.0898 16.8954 42.0898 18Z" fill="currentColor" className="text-gray-800 group-hover:text-yellow-500 transition-colors duration-300"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M40.0899 2.0365e-06C40.7659 2.1547e-06 41.4332 0.0372686 42.0898 0.109859V2.12379C41.4347 2.04209 40.7672 2 40.0899 2C36.5517 2 33.2835 3.14743 30.6345 5.09135C31.1162 5.55951 31.5717 6.0544 31.9988 6.57362C34.2835 4.95312 37.0764 4 40.0899 4C40.7689 4 41.4367 4.04834 42.0898 4.14177V6.16591C41.4394 6.0568 40.7713 6 40.0899 6C37.5171 6 35.1352 6.80868 33.1819 8.18644C33.547 8.74673 33.8817 9.3286 34.1837 9.92973C35.8384 8.71698 37.8811 8 40.0899 8C40.7748 8 41.4436 8.06886 42.0898 8.20003V10.252C41.4506 10.0875 40.7805 10 40.0899 10C38.1572 10 36.386 10.6843 35.0029 11.8253C35.2578 12.5233 35.4707 13.2415 35.6386 13.9768C36.7365 12.7628 38.3241 12 40.0899 12C40.7911 12 41.4643 12.1203 42.0898 12.3414V14.5351C41.5015 14.1948 40.8185 14 40.0899 14C37.8808 14 36.0899 15.7909 36.0899 18C36.0899 20.2091 37.8808 22 40.0899 22C42.299 22 44.0899 20.2091 44.0899 18L44.0898 17.9791V0.446033C52.1058 2.26495 58.0899 9.43365 58.0899 18C58.0899 27.9411 50.031 36 40.0899 36C35.9474 36 32.1317 34.6006 29.0898 32.2488C26.0482 34.6002 22.2313 36 18.0898 36C17.4138 36 16.7465 35.9627 16.0898 35.8901V33.8762C16.745 33.9579 17.4125 34 18.0898 34C21.6281 34 24.8962 32.8525 27.5452 30.9086C27.0636 30.4405 26.6081 29.9456 26.181 29.4264C23.8963 31.0469 21.1033 32 18.0899 32C17.4108 32 16.7431 31.9517 16.0898 31.8582V29.8341C16.7403 29.9432 17.4085 30 18.0899 30C20.6628 30 23.0446 29.1913 24.9979 27.8136C24.6328 27.2533 24.2981 26.6714 23.996 26.0703C22.3414 27.283 20.2987 28 18.0899 28C17.405 28 16.7361 27.9311 16.0898 27.7999V25.7479C16.7291 25.9125 17.3993 26 18.0899 26C20.0226 26 21.7938 25.3157 23.1769 24.1747C22.922 23.4767 22.7091 22.7585 22.5412 22.0232C21.4433 23.2372 19.8557 24 18.0899 24C17.3886 24 16.7154 23.8797 16.0898 23.6586V21.4648C16.6782 21.8052 17.3613 22 18.0899 22C20.299 22 22.0899 20.2091 22.0899 18C22.0899 15.7909 20.299 14 18.0899 14C15.8808 14 14.0899 15.7909 14.0899 18L14.0898 35.554C6.07389 33.7351 0.0898438 26.5663 0.0898438 18C0.0898438 8.05887 8.14877 0 18.0899 0C22.2324 0 26.048 1.39934 29.0899 3.75111C32.1316 1.3998 35.9483 0 40.0899 2.0365e-06ZM46.0898 3.16303V5.34723C50.8198 7.59414 54.0899 12.4152 54.0899 18C54.0899 25.732 47.8219 32 40.0899 32C32.3579 32 26.0899 25.732 26.0899 18C26.0899 13.5817 22.5082 10 18.0899 10C13.6716 10 10.0899 13.5817 10.0899 18C10.0899 20.0289 10.8452 21.8814 12.0899 23.2916V18C12.0899 14.6863 14.7762 12 18.0899 12C21.4036 12 24.0899 14.6863 24.0899 18C24.0899 26.8366 31.2533 34 40.0899 34C48.9265 34 56.0898 26.8366 56.0898 18C56.0898 11.2852 51.9535 5.53658 46.0898 3.16303ZM12.0899 26.0007L12.0898 28.3946C8.50306 26.3197 6.0899 22.4417 6.0899 18C6.0899 11.3726 11.4625 6 18.0899 6C24.7173 6 30.0899 11.3726 30.0899 18C30.0899 23.5228 34.5671 28 40.0899 28C45.6127 28 50.0899 23.5228 50.0899 18C50.0899 14.7284 48.5188 11.8237 46.0899 9.99929V7.60538C49.6767 9.68023 52.0899 13.5583 52.0899 18C52.0899 24.6274 46.7173 30 40.0899 30C33.4625 30 28.0899 24.6274 28.0899 18C28.0899 12.4772 23.6127 8 18.0899 8C12.567 8 8.08992 12.4772 8.08992 18C8.08992 21.2716 9.66101 24.1763 12.0899 26.0007ZM4.0899 18C4.0899 23.5848 7.35998 28.4058 12.0898 30.6527V32.837C6.2262 30.4634 2.08989 24.7148 2.0899 18C2.0899 9.16344 9.25334 2 18.0899 2C26.9265 2 34.0899 9.16344 34.0899 18C34.0899 21.3137 36.7762 24 40.0899 24C43.4036 24 46.0899 21.3137 46.0899 18L46.0899 12.7084C47.3346 14.1186 48.0899 15.9711 48.0899 18C48.0899 22.4183 44.5082 26 40.0899 26C35.6716 26 32.0899 22.4183 32.0899 18C32.0899 10.268 25.8219 4 18.0899 4C10.3579 4 4.0899 10.268 4.0899 18Z" fill="currentColor" className="text-gray-800 group-hover:text-yellow-500 transition-colors duration-300"></path>
          </svg>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 border border-gray-200/50 shadow-sm">
          <a href="#" className="px-4 py-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-300 font-semibold text-sm">
            Building Guide
          </a>
          <a href="#" className="px-4 py-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-300 font-semibold text-sm">
            Products
          </a>
          <div className="relative group">
            <button className="px-4 py-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-300 font-semibold text-sm flex items-center gap-2">
              Tools 
              <ChevronDown size={14} className="transform group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 top-full right-0 mt-3 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl w-64 z-50 overflow-hidden">
              <div className="p-2">
                {[
                  { name: 'Cost Calculator', desc: 'Estimate project costs', link: '/cost-calculator' },
                  { name: 'Product Predictor', desc: 'Smart recommendations', link: '/product-predictor' },
                  { name: 'EMI Calculator', desc: 'Payment planning', link: '/emi-calculator' }
                ].map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.link}
                    className="block p-3 hover:bg-yellow-50 rounded-xl transition-all duration-200 group/item"
                  >
                    <div className="font-semibold text-gray-800 text-sm group-hover/item:text-yellow-600">
                      {tool.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tool.desc}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Auth Buttons & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <button className="flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 hover:bg-yellow-50 group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:shadow-md">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                </button>
                <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 top-full right-0 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl w-56 z-50 overflow-hidden divide-y divide-gray-100">
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {user.email}
                    </div>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <span>Sign Out</span>
                      <LogOut size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 text-gray-700 hover:text-yellow-600 font-semibold text-sm transition-all duration-300 hover:bg-yellow-50 rounded-full border border-gray-200 bg-white/70 hover:border-yellow-300 shadow-sm hover:shadow-md"
              >
                Log In
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          )}

          <button
            className="lg:hidden p-2.5 rounded-xl bg-white/70 border border-gray-200 hover:bg-white transition-all duration-200 shadow-sm"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="relative w-5 h-5">
              <Menu 
                size={20} 
                className={`absolute inset-0 text-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} 
              />
              <X 
                size={20} 
                className={`absolute inset-0 text-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-yellow-300 hover:scrollbar-thumb-yellow-400">
            <div className="p-4 space-y-2">
              <a href="#" className="block p-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50/80 rounded-xl transition-all duration-200 font-semibold">
                Building Guide
              </a>
              <a href="#" className="block p-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50/80 rounded-xl transition-all duration-200 font-semibold">
                Products
              </a>
              <div className="pt-2 mt-3">
                <button
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50/80 rounded-xl transition-all duration-200 font-semibold"
                  onClick={() => setToolsOpen(!toolsOpen)}
                >
                  <span>Tools & Calculators</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-300 ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>
                {toolsOpen && (
                  <div className="pl-4 space-y-1 mt-2">
                    {[
                      { name: 'Cost Calculator', desc: 'Estimate project costs', link: '/cost-calculator' },
                      { name: 'Product Predictor', desc: 'Smart recommendations', link: '/product-predictor' },
                      { name: 'EMI Calculator', desc: 'Payment planning', link: '/emi-calculator' }
                    ].map((tool) => (
                      <a
                        key={tool.name}
                        href={tool.link}
                        className="block p-2.5 hover:bg-yellow-50/60 rounded-lg transition-all duration-200"
                      >
                        <div className="font-medium text-gray-700 text-sm hover:text-yellow-600">
                          {tool.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {tool.desc}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <div className="pt-3 mt-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-50/70 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-4 space-y-2">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full py-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50/80 rounded-xl font-semibold transition-all duration-300 border border-gray-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showSignupModal && (
        <SignupModal 
          isOpen={showSignupModal} 
          onClose={() => setShowSignupModal(false)}
          onSignupSuccess={handleLoginSuccess}
        />
      )}
      <Toaster />
    </header>
  );
};

export default Header;
