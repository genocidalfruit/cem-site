import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Header from './Header';
import Footer from './Footer';

import { Printer, Share2, FileText } from 'lucide-react';

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
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'bottom',
                labels: {
                  boxWidth: 12,
                  padding: 10,
                  fontSize: 10
                }
              },
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
            maintainAspectRatio: false,
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
                  font: {
                    size: window.innerWidth < 768 ? 10 : 12
                  }
                },
              },
              y: {
                stacked: true,
                ticks: {
                  display: window.innerWidth >= 768,
                  font: {
                    size: window.innerWidth < 768 ? 8 : 10
                  }
                }
              },
            },
          },
          plugins: [{
            id: 'custom_canvas_background_color',
            beforeDraw: (chart) => {
              const ctx = chart.canvas.getContext('2d');
              ctx.save();
              ctx.globalCompositeOperation = 'destination-over';
              ctx.fillStyle = '#f4f4f4';
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
          }],
        });
      }
    }
  }, [resultsVisible]);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col"
    style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a9a9a9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '40px 40px',
      }}>
      <Header />
      
      <div className='flex-grow m-5 sm:m-4 md:m-8 mt-25 sm:mt-24 md:mt-28 border border-gray-300 rounded-md bg-gray-100 drop-shadow-xs'>
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl tracking-wide pt-4 sm:pt-6 md:pt-7 pb-6 sm:pb-8 md:pb-10 text-gray-800 font-extrabold px-4">
          Construction Cost Estimator
        </h1>
        
        {/* Input Form */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-10 px-4 sm:px-6">
          <div className="w-full sm:w-auto">
            <label className="block mb-1 font-semibold text-gray-700">State</label>
            <select
              className="w-full sm:w-52 p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-yellow-400"
              value={state}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {Object.keys(cityMap).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block mb-1 font-semibold text-gray-700">City</label>
            <select
              className="w-full sm:w-52 p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-yellow-400"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select City</option>
              {(cityMap[state] || []).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block mb-1 font-semibold text-gray-700">Area</label>
            <input
              type="number"
              className="w-full sm:w-52 p-2 border border-gray-300 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-yellow-400"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-2 sm:mt-7 text-sm text-gray-700 w-full sm:w-auto">
            <div className="flex gap-6">
              <label><input type="radio" name="areaUnit" value="sqft" defaultChecked className="mr-1" /> Sq. Feet</label>
              <label><input type="radio" name="areaUnit" value="sqm" className="mr-1" /> Sq. Meter</label>
            </div>
            
            <button
              className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-lg shadow-sm transition-colors duration-200 font-semibold w-full sm:w-auto"
              onClick={calculateCost}
            >
              Next →
            </button>
          </div>
        </div>

        {!resultsVisible && (
          <div className="flex flex-col items-center justify-center py-10 sm:py-20 text-gray-400">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 mb-4" />
            <p className="text-base sm:text-lg font-medium px-4 text-center">Enter details to generate report</p>
          </div>
        )}

        {resultsVisible && (
          <div className="px-2 sm:px-4 md:px-6">
            <div className="bg-gray-100 shadow-lg rounded-xl pt-5 max-w-6xl mx-auto border border-gray-300 px-3 sm:px-4 md:px-6 pb-6">
              
              {/* Cost Chart */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-5 text-center text-gray-600 uppercase tracking-wide px-2">
                Total Estimated Cost (INR)
              </h2>
              <div className="mb-6 sm:mb-10 flex justify-center">
                <div className='w-full max-w-lg h-64 sm:h-80 md:h-96'>
                  <canvas ref={doughnutChartRef}></canvas>
                </div>
              </div>

              {/* Timeline Chart */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-5 text-center text-gray-600 uppercase tracking-wide px-2">
                Timeline Tracking
              </h2>
              <div className="flex justify-center mb-6 sm:mb-10">
                <div className="w-full max-w-4xl h-64 sm:h-80 md:h-96">
                  <canvas ref={barChartRef}></canvas>
                </div>
              </div>

              {/* Resource Allocation Table */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-6 sm:mt-10 mb-5 text-center text-gray-600 uppercase tracking-wide px-2">
                Resource Allocation
              </h2>
              
              {/* Mobile-optimized table */}
              <div className="overflow-x-auto">
                <table className="w-full border-separate border border-gray-300 text-left text-xs sm:text-sm text-gray-800 bg-white shadow-md rounded-md min-w-full">
                  <thead className="bg-gray-200 text-gray-800 rounded-md">
                    <tr>
                      <th className="border border-gray-300 p-2 min-w-32">Resource</th>
                      <th className="border border-gray-300 p-2 min-w-24">Quantity</th>
                      <th className="border border-gray-300 p-2 min-w-48">Quality</th>
                      <th className="border border-gray-300 p-2 min-w-24">Amount</th>
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
                          <td className="border border-gray-300 p-2">
                            <div className="flex items-center flex-wrap">
                              <span className="sm:hidden">{resourceIcons[resource]}</span>
                              <span className="hidden sm:inline">{resourceIcons[resource]}</span>
                              <span className="text-xs sm:text-sm">{resource}</span>
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2 text-xs sm:text-sm">{quantity}</td>
                          <td className="border border-gray-300 p-2">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                              {['Basic', 'Medium', 'Premium'].map((q) => (
                                <label key={q} className="text-xs sm:text-sm text-gray-800 cursor-pointer flex items-center">
                                  <input
                                    type="radio"
                                    name={`${resource}-quality`}
                                    value={q}
                                    checked={quality === q}
                                    onChange={() => handleQualityChange(resource, q)}
                                    className="mr-1"
                                  /> 
                                  <span>{q}</span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2 text-xs sm:text-sm font-medium">₹{amount.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6 pb-5 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button 
                  onClick={toggleShareModal}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {/* Share Modal */}
              {showShareModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                  <div className="absolute inset-0 bg-black opacity-50" onClick={toggleShareModal}></div>
                  <div className="bg-white rounded-lg p-4 sm:p-6 z-10 shadow-xl w-full max-w-sm">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Share Your Estimate</h3>
                    <div className="flex justify-center space-x-3 sm:space-x-4">
                      <FacebookShareButton url={window.location.href}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <TwitterShareButton url={window.location.href}>
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                      <WhatsappShareButton url={window.location.href}>
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                      <LinkedinShareButton url={window.location.href}>
                        <LinkedinIcon size={32} round />
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

            {/* Summary Footer */}
            <div className='flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 p-4 sm:p-6 bg-yellow-100 font-semibold text-yellow-800 gap-4 sm:gap-20 shadow-inner rounded-lg'>
              <div className="text-center sm:text-left">Cost per sqfeet: ₹{costPerSqft.toLocaleString()}</div>
              <div className="text-center sm:text-left">Total Amount: ₹{totalAmount.toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CostCalc;