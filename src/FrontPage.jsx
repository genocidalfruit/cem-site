import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator,
  Banknote,
  Video,
  Bot,
  SlidersHorizontal,
  MessageCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Carousel from './Carousel.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const FrontPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [highlightChatButton, setHighlightChatButton] = useState(false);
  const chatButtonRef = useRef(null);
  const navigate = useNavigate();

  // Inject Zapier script once
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="zapier-interfaces"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      script.type = 'module';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChatFeatureClick = () => {
    setChatOpen(true);
    setHighlightChatButton(true);
    chatButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => setHighlightChatButton(false), 2000);
  };

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
      onClick: handleChatFeatureClick
    }
  ];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-repeat flex flex-col">
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

      <div className="border border-gray-100/20 p-10 mx-auto rounded-xl bg-gray-100 drop-shadow-xl mb-10 flex-grow max-w-7xl w-full">
        <section className="px-6 flex flex-wrap justify-center gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick ? item.onClick : () => navigate(item.link)}
              className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg transition block hover:bg-yellow-50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
            >
              <div className="flex flex-col">
                {item.icon}
                <h3 className="text-xl font-bold text-yellow-600 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        ref={chatButtonRef}
        onClick={() => setChatOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-50 bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-full shadow-xl"
        aria-label="Toggle Chatbot"
        animate={
          highlightChatButton
            ? { scale: [1, 1.3, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
        onAnimationComplete={() => {
          if (highlightChatButton) {
            setHighlightChatButton(false);
          }
        }}
      >
        {chatOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </motion.button>

      {/* Chatbot Embed (always mounted, hidden via CSS) */}
      <motion.div
        initial={false}
        animate={{ opacity: chatOpen ? 1 : 0, y: chatOpen ? 0 : 30, pointerEvents: chatOpen ? 'auto' : 'none' }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 right-6 z-40 w-[400px] h-[600px] overflow-hidden border border-gray-500/20 rounded-xl shadow-xl bg-white"
        style={{ display: 'block' }}
      >
        <zapier-interfaces-chatbot-embed
          is-popup="false"
          chatbot-id="cmaz54d1q008v10tgyakwjtrs"
          height="600px"
          width="400px"
        ></zapier-interfaces-chatbot-embed>
      </motion.div>

      <Footer />
    </div>
  );
};

export default FrontPage;
