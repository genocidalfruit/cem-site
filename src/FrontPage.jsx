import { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  Banknote,
  Video,
  Bot,
  SlidersHorizontal,
  MessageSquare,
  X
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
      description: 'Estimate total project costs based on inputs.',
      link: '/cost-calculator',
      icon: <Calculator className="w-6 h-6 text-yellow-600 mb-2" />
    },
    {
      title: 'Smart Material Selector',
      description: 'Find the best building materials based on your requirements.',
      link: '/product-predictor',
      icon: <SlidersHorizontal className="w-6 h-6 text-yellow-600 mb-2" />
    },
    {
      title: 'EMI Calculator',
      description: 'Plan your loan repayments with flexible EMIs.',
      link: '/emi-calculator',
      icon: <Banknote className="w-6 h-6 text-yellow-600 mb-2" />
    },
    {
      title: 'Informational Videos',
      description: 'Watch curated videos to guide your construction journey.',
      link: '/videos',
      icon: <Video className="w-6 h-6 text-yellow-600 mb-2" />
    },
    {
      title: 'Chatbot',
      description: 'Ask questions and get real-time assistance.',
      link: '#',
      icon: <Bot className="w-6 h-6 text-yellow-600 mb-2" />,
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
          chatbot-id="cmaz54d1q008v10tgyakwjtrs"
          style="width:100%;height:100%;display:block;"
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
    <div className="min-h-screen font-sans text-gray-800 bg-repeat flex flex-col relative">
      <Header />
      <Carousel />

      <div className="text-center px-4 py-10 mt-9">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-yellow-600">Nirman Saathi</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Your trusted partner in building your dream home.
        </p>
      </div>

      <h2 className="text-3xl mt-8 font-bold text-center text-gray-800 mb-3">OUR FEATURES</h2>

      <div className="border border-gray-100/20 p-4 sm:p-10 mx-auto rounded-xl bg-gray-100 drop-shadow-xl mb-10 flex-grow max-w-7xl w-full">
        <section className="px-2 sm:px-6 flex flex-wrap justify-center gap-4 sm:gap-8">
          {features.map((item, idx) => (
            <button
              key={idx}
              onClick={item.isChatbot ? handleChatbotClick : undefined}
              className="bg-white text-left p-4 sm:p-6 rounded-xl shadow hover:shadow-lg transition block hover:bg-yellow-50 w-[95%] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
            >
              <div className="flex flex-col">
                {item.icon}
                <h3 className="text-xl font-bold text-yellow-600 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 bg-yellow-600 text-white rounded-full p-4 shadow-lg hover:bg-yellow-700"
        initial={{ scale: 1 }}
        animate={pulse ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chatbot Container */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chatbot"
            className={`fixed z-[9999] overflow-hidden bg-white ${
              isMobile
                ? 'top-0 left-0 w-screen h-screen'
                : 'bottom-[100px] right-6 w-[90vw] sm:w-[400px] h-[400px] sm:h-[500px] rounded-xl shadow-xl'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Close Button */}
            <button
              onClick={closeChatbot}
              className="absolute top-3 right-3 z-50 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            {/* Embed Container */}
            <div
              ref={chatbotContainerRef}
              className="w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default FrontPage;