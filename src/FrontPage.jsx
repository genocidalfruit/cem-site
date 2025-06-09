import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Banknote,
  Video,
  Bot,
  SlidersHorizontal,
  MessageSquare,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Carousel from './Carousel.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const FrontPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const chatbotContainerRef = useRef(null);

  const features = [
    {
      title: 'Cost Calculator',
      description: 'Estimate total project costs with precision and detailed breakdowns.',
      link: '/cost-calculator',
      icon: <Calculator className="w-7 h-7 text-yellow-500" />
    },
    {
      title: 'Product Predictor',
      description: 'AI-powered recommendations for optimal building materials.',
      link: '/product-predictor',
      icon: <SlidersHorizontal className="w-7 h-7 text-yellow-500" />
    },
    {
      title: 'EMI Calculator',
      description: 'Smart loan planning with flexible repayment options.',
      link: '/emi-calculator',
      icon: <Banknote className="w-7 h-7 text-yellow-500" />
    },
    {
      title: 'Video Library',
      description: 'Expert-curated content to guide your construction journey.',
      link: '/videos',
      icon: <Video className="w-7 h-7 text-yellow-500" />
    },
    {
      title: 'AI Assistant',
      description: 'Instant answers and personalized construction guidance.',
      link: '#',
      icon: <Bot className="w-7 h-7 text-yellow-500" />,
      isChatbot: true
    },
  ];

  // Load Zapier script
  useEffect(() => {
    const scriptId = 'zapier-chatbot-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      script.type = 'module';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Resize handler to detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when chatbot is open on mobile
  useEffect(() => {
    if (chatOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [chatOpen, isMobile]);

  // Render Zapier chatbot
  useEffect(() => {
    if (chatOpen && chatbotContainerRef.current) {
      chatbotContainerRef.current.innerHTML = `
        <zapier-interfaces-chatbot-embed
          is-popup="false"
          chatbot-id="cmbopo1oi0023k54wrqqalob3"
          style="width:100%;height:100%;display:block;box-sizing:border-box;overflow:hidden;"
        ></zapier-interfaces-chatbot-embed>
      `;
    } else if (chatbotContainerRef.current) {
      chatbotContainerRef.current.innerHTML = '';
    }
  }, [chatOpen]);

  const handleChatbotClick = () => {
    setPulse(true);
    setChatOpen(true);
    setTimeout(() => setPulse(false), 1500);
  };

  const closeChatbot = () => setChatOpen(false);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-100 flex flex-col relative">
      <Header />
      <Carousel />

      {/* Hero Section */}
      <motion.div 
        className="text-center px-6 py-16 lg:py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
            Nirman Saathi
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
          Your intelligent partner in building extraordinary homes with confidence and precision.
        </p>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to plan, build, and manage your construction project in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              {item.isChatbot ? (
                <button
                  onClick={handleChatbotClick}
                  className="w-full h-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-left group-hover:border-yellow-300/50"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
                        {item.icon}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {item.description}
                    </p>
                  </div>
                </button>
              ) : (
                <Link
                  to={item.link}
                  className="block w-full h-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-yellow-300/50"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
                        {item.icon}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-yellow-400/20"
        initial={{ scale: 1 }}
        animate={pulse ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-6 h-6" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </motion.button>

      {/* Chatbot Container */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chatbot"
            className={`fixed z-[9999] overflow-hidden bg-white/95 backdrop-blur-xl border border-gray-200/50 ${
              isMobile
                ? 'top-0 left-0 w-screen h-screen'
                : 'bottom-[120px] right-8 w-[90vw] sm:w-[420px] h-[500px] sm:h-[600px] rounded-2xl shadow-2xl'
            }`}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Close Button */}
            <motion.button
              onClick={closeChatbot}
              className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/90 transition-all duration-200"
              aria-label="Close chatbot"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5 text-gray-700" />
            </motion.button>

            {/* Embed Container */}
            <div
              ref={chatbotContainerRef}
              className="w-full h-full rounded-2xl overflow-hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default FrontPage;