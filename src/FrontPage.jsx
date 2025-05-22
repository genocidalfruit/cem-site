import { Link } from 'react-router-dom';
import { 
  Hammer, 
  CalendarCheck,
  Calculator, 
  Store, 
  Sparkles, 
  Banknote, 
  Square, 
  Video, 
  Bot 
} from 'lucide-react'; // Lucide icons

import Carousel from './Carousel.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const FrontPage = () => {
  const features = [
    { 
      title: 'Material Estimator', 
      description: 'Get a cost breakdown by resource and quality.', 
      link: '/material-estimator',
      icon: <Hammer className="w-6 h-6 text-yellow-600 mb-2" />
    },
    { 
      title: 'Construction Timeline', 
      description: 'Plan out each phase with our smart tracker.', 
      link: '/construction-timeline',
      icon: <CalendarCheck className="w-6 h-6 text-yellow-600 mb-2" />
    },
    { 
      title: 'Cost Calculator', 
      description: 'Estimate total project costs based on inputs.', 
      link: '/cost-calculator',
      icon: <Calculator className="w-6 h-6 text-yellow-600 mb-2" />
    },
    { 
      title: 'Store Locator', 
      description: 'Find nearby material suppliers and vendors.', 
      link: '/store-locator',
      icon: <Store className="w-6 h-6 text-yellow-600 mb-2" />
    },
    { 
      title: 'Product Predictor', 
      description: 'Get AI-powered suggestions for optimal products.', 
      link: '/product-predictor',
      icon: <Sparkles className="w-6 h-6 text-yellow-600 mb-2" />
    },
    { 
      title: 'EMI Calculator', 
      description: 'Plan your loan repayments with flexible EMIs.', 
      link: '/emi-calculator',
      icon: <Banknote className="w-6 h-6 text-yellow-600 mb-2" />
    },
    { 
      title: 'Tile Calculator', 
      description: 'Accurately calculate tile needs for your space.', 
      link: '/tile-calculator',
      icon: <Square className="w-6 h-6 text-yellow-600 mb-2" />
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
      link: '/chatbot',
      icon: <Bot className="w-6 h-6 text-yellow-600 mb-2" />
    },
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
        <section className="px-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <Link to={item.link} key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition block hover:bg-yellow-50">
              <div className="flex flex-col">
                {item.icon}
                <h3 className="text-xl font-bold text-yellow-600 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FrontPage;