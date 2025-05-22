import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Header from './Header.jsx'
import Footer from './Footer.jsx';

import { Printer, Share2 } from 'lucide-react';

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon
} from 'react-share';

import {
  Truck,
  Hammer,
  Layers,
  Waves,
  Layout,
  DoorOpen,
  Zap,
  Paintbrush,
  Cuboid,
  Grid2X2
} from 'lucide-react';

const CostCalc = () => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState(5000);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [resourceQualities, setResourceQualities] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);

  const cityMap = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool'],
    'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Pasighat', 'Ziro', 'Bomdila'],
    Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
    Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    Chhattisgarh: ['Raipur', 'Bilaspur', 'Durg', 'Korba', 'Jagdalpur'],
    Goa: ['Panaji', 'Margao'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi'],
    Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    Karnataka: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    Kerala: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    Manipur: ['Imphal', 'Churachandpur', 'Thoubal', 'Senapati', 'Ukhrul'],
    Meghalaya: ['Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara'],
    Mizoram: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib'],
    Nagaland: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
    Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur'],
    Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
    Sikkim: ['Gangtok', 'Namchi', 'Gyalshing', 'Ravangla', 'Mangan'],
    TamilNadu: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
    Tripura: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Amarpur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut'],
    Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital', 'Almora', 'Rishikesh'],
    'West Bengal': ['Kolkata', 'Darjeeling', 'Siliguri', 'Howrah', 'Durgapur'],

    'Andaman And Nicobar Islands': ['Port Blair'],
    Chandigarh: ['Chandigarh'],
    'Dadra & Nagar Haveli And Daman & Diu': ['Daman', 'Silvassa'],
    Delhi: ['New Delhi'],
    Lakshadweep: ['Kavaratti'],
    Puducherry: ['Puducherry'],
    'Jammu And Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Leh'],
    Ladakh: ['Leh', 'Kargil']
  };

  const resourceIcons = {
  Cement: <Truck className="inline-block w-4 h-4 mr-2" />,
  Steel: <Hammer className="inline-block w-4 h-4 mr-2" />,
  Bricks: <Cuboid className="inline-block w-4 h-4 mr-2" />,
  Aggregate: <Layers className="inline-block w-4 h-4 mr-2" />,
  Sand: <Waves className="inline-block w-4 h-4 mr-2" />,
  Flooring: <Layout className="inline-block w-4 h-4 mr-2" />,
  Windows: <Grid2X2 className="inline-block w-4 h-4 mr-2" />,
  Doors: <DoorOpen className="inline-block w-4 h-4 mr-2" />,
  'Electrical fittings': <Zap className="inline-block w-4 h-4 mr-2" />,
  Painting: <Paintbrush className="inline-block w-4 h-4 mr-2" />,
  };

  const baseResources = [
    { resource: 'Cement', quantity: '2250 bags', baseAmount: 771150 },
    { resource: 'Steel', quantity: '17500 tons', baseAmount: 805000 },
    { resource: 'Bricks', quantity: '95000 pieces', baseAmount: 665000 },
    { resource: 'Aggregate', quantity: '9500 cubic feet', baseAmount: 313500 },
    { resource: 'Sand', quantity: '10000 cubic feet', baseAmount: 360000 },
    { resource: 'Flooring', quantity: '5000 sq. feet', baseAmount: 490000 },
    { resource: 'Windows', quantity: '850 sq. feet', baseAmount: 175100 },
    { resource: 'Doors', quantity: '900 sq. feet', baseAmount: 240300 },
    { resource: 'Electrical fittings', quantity: '750 sq. feet', baseAmount: 58500 },
    { resource: 'Painting', quantity: '30000 sq. feet', baseAmount: 660000 },
  ];

  const qualityMultipliers = {
    Basic: 1,
    Medium: 1.25,
    Premium: 1.5,
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
    setCity('');
  };

  const calculateCost = () => {
    if (!state || !city || !area) {
      alert('Please complete all inputs.');
      return;
    }

    const initialQualities = {};
    baseResources.forEach(({ resource }) => {
      initialQualities[resource] = 'Basic';
    });
    setResourceQualities(initialQualities);
    setResultsVisible(true);
  };

  const handleQualityChange = (resource, quality) => {
    setResourceQualities((prev) => ({
      ...prev,
      [resource]: quality,
    }));
  };

  const getAmount = (baseAmount, quality) => {
    return Math.round(baseAmount * qualityMultipliers[quality]);
  };

  const totalAmount = baseResources.reduce((sum, { resource, baseAmount }) => {
    const quality = resourceQualities[resource] || 'Basic';
    return sum + getAmount(baseAmount, quality);
  }, 0);

  const costPerSqft = Math.round(totalAmount / area);

  const toggleShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  useEffect(() => {
    if (resultsVisible) {
      if (doughnutChartRef.current) {
        const ctx1 = doughnutChartRef.current.getContext('2d');
        new Chart(ctx1, {
          type: 'doughnut',
          data: {
            labels: [
              'Home Design & Approval',
              'Excavation',
              'Footing & Foundation',
              'RCC Work - Columns & Slabs',
              'Roof Slab',
              'Brickwork and Plastering',
              'Flooring & Tiling',
              'Electric Wiring',
              'Water Supply & Plumbing',
              'Door',
            ],
            datasets: [
              {
                data: [10, 12, 15, 20, 10, 8, 7, 6, 6, 6],
                backgroundColor: [
                  '#FFCE56', '#4BC0C0', '#36A2EB', '#FF6384', '#9966FF',
                  '#C9CBCF', '#FFA500', '#800080', '#008000', '#000000',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
          },
        });
      }

      if (barChartRef.current) {
        const ctx2 = barChartRef.current.getContext('2d');
        new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: [
              'Home Design & Approval',
              'Excavation',
              'Footing & Foundation',
              'RCC Work - Columns & Slabs',
              'Roof Slab',
              'Brickwork and Plastering',
              'Flooring & Tiling',
              'Electric Wiring',
              'Water Supply & Plumbing',
              'Door',
            ],
            datasets: [
              {
                label: 'Offset',
                data: [0, 46, 60, 101, 118, 155, 163, 188, 202, 232],
                backgroundColor: 'transparent',
              },
              {
                label: 'Duration',
                data: [46, 14, 41, 17, 37, 8, 25, 14, 30, 15],
                backgroundColor: '#FFCE56',
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const index = context.dataIndex;
                    const durations = [46, 14, 41, 17, 37, 8, 25, 14, 30, 15];
                    const costs = [
                      '₹ 2,15,000', '₹ 1,05,750', '₹ 7,86,000', '₹ 5,25,000',
                      '₹ 4,38,000', '₹ 85,500', '₹ 3,80,000', '₹ 1,05,750',
                      '₹ 65,500', '₹ 2,00,000',
                    ];
                    return `${durations[index]} Days | ${costs[index]}`;
                  },
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Overall duration in days (Total ~247 Days)',
                },
              },
              y: {
                stacked: true,
              },
            },
          },
          plugins: [{
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
              const ctx = chart.canvas.getContext('2d');
              ctx.save();
              ctx.globalCompositeOperation = 'destination-over';
              ctx.fillStyle = '#f4f4f4'; // light background
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
          }],
        });
      }
    }
  }, [resultsVisible]);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
      <Header />
      <div className='flex-grow m-8 mt-23 border border-gray-300/50 rounded-md bg-gray-100/20 drop-shadow-xs'>
      <h1 className="text-center text-4xl tracking-wide pt-7 pb-10 text-gray-800 font-extrabold">Construction Cost Estimator</h1>
      <div className="flex flex-wrap justify-center gap-6 mb-10 px-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Select State</label>
          <select
            className="w-52 p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-yellow-400"
            value={state}
            onChange={handleStateChange}
          >
            <option value="">Select State</option>
            {Object.keys(cityMap).map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Select City</label>
          <select
            className="w-52 p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-yellow-400"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select City</option>
            {(cityMap[state] || []).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Area</label>
          <input
            type="number"
            className="w-52 p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-yellow-400"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-6 mt-7 text-sm text-gray-700">
          <label><input type="radio" name="areaUnit" value="sqft" defaultChecked className="mr-1" /> Sq. Feet</label>
          <label><input type="radio" name="areaUnit" value="sqm" className="mr-1" /> Sq. Meter</label>
        </div>

        <div>
          <button
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 mt-6 rounded-lg shadow-sm transition-colors duration-200 font-semibold"
            onClick={calculateCost}
          >
            Next →
          </button>
        </div>
      </div>

      {resultsVisible && (
        <div>
          <div className="bg-gray-100 shadow-lg rounded-xl pt-5 max-w-4xl mx-auto border border-gray-300 px-6 pb-6">
            <h2 className="text-2xl font-semibold mb-5 text-center text-gray-600 uppercase tracking-wide">Total Estimated Cost (INR)</h2>
            <div className="mb-10 flex justify-center">
              <div className='w-3/5 h-3/5'>
                <canvas ref={doughnutChartRef}></canvas>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-5 text-center text-gray-600 uppercase tracking-wide">Timeline Tracking</h2>
            <div className="flex justify-center">
              <canvas ref={barChartRef} className="w-3/4 h-60"></canvas>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-5 text-center text-gray-600 uppercase tracking-wide">Resource Allocation</h2>
            <table className="w-full border-separate border border-gray-300 text-left text-sm text-gray-800 bg-white shadow-md p-1 rounded-md">
              <thead className="bg-gray-200 text-gray-800 rounded-md">
                <tr>
                  <th className="border border-gray-300 p-2">Resource</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Quality</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {baseResources.map(({ resource, quantity, baseAmount }, index) => {
                  const quality = resourceQualities[resource] || 'Basic';
                  const amount = getAmount(baseAmount, quality);
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <td className="border border-gray-300 p-2">{resourceIcons[resource]}{resource}</td>
                      <td className="border border-gray-300 p-2">{quantity}</td>
                      <td className="border border-gray-300 p-2">
                        {['Basic', 'Medium', 'Premium'].map((q) => (
                          <label key={q} className="mr-3 text-gray-800 cursor-pointer">
                            <input
                              type="radio"
                              name={`${resource}-quality`}
                              value={q}
                              checked={quality === q}
                              onChange={() => handleQualityChange(resource, q)}
                              className="mr-1"
                            /> {q}
                          </label>
                        ))}
                      </td>
                      <td className="border border-gray-300 p-2">₹{amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-center space-x-4 mt-6 pb-5 print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button 
                onClick={toggleShareModal}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>

              {/* Share Modal */}
              {showShareModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="absolute inset-0 bg-black opacity-50" onClick={toggleShareModal}></div>
                  <div className="bg-white rounded-lg p-6 z-10 shadow-xl">
                    <h3 className="text-xl font-semibold mb-4 text-center">Share Your Estimate</h3>
                    <div className="flex justify-center space-x-4">
                      <FacebookShareButton url={window.location.href}>
                        <FacebookIcon size={40} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={window.location.href}>
                        <TwitterIcon size={40} round />
                      </TwitterShareButton>
                      <WhatsappShareButton url={window.location.href}>
                        <WhatsappIcon size={40} round />
                      </WhatsappShareButton>
                      <LinkedinShareButton url={window.location.href}>
                        <LinkedinIcon size={40} round />
                      </LinkedinShareButton>
                    </div>
                    <button 
                      onClick={toggleShareModal}
                      className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md w-full font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='flex justify-center mt-6 p-6 bg-yellow-100 font-semibold text-yellow-800 gap-20 shadow-inner'>
            <div>Cost per sqfeet: ₹{costPerSqft.toLocaleString()}</div>
            <div>Total Amount: ₹{totalAmount.toLocaleString()}</div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default CostCalc;