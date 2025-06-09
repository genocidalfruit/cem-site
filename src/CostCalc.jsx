import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import { Printer, Share2, FileText, ChevronRight, Calculator, MapPin, Home } from 'lucide-react';

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

import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';

import Header from './Header';
import Footer from './Footer';

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
    Cement: <Truck className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Steel: <Hammer className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Bricks: <Cuboid className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Aggregate: <Layers className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Sand: <Waves className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Flooring: <Layout className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Windows: <Grid2X2 className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Doors: <DoorOpen className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    'Electrical fittings': <Zap className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Painting: <Paintbrush className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
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
                  '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6',
                  '#6B7280', '#F97316', '#7C3AED', '#059669', '#374151',
                ],
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: '#ffffff',
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
                  boxWidth: window.innerWidth < 768 ? 8 : 12,
                  padding: window.innerWidth < 768 ? 8 : 15,
                  font: {
                    size: window.innerWidth < 768 ? 9 : 11
                  },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
            },
            cutout: '60%',
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
                backgroundColor: '#F59E0B',
                borderRadius: 4,
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#F59E0B',
                borderWidth: 1,
                cornerRadius: 8,
                titleFont: {
                  size: window.innerWidth < 768 ? 11 : 13
                },
                bodyFont: {
                  size: window.innerWidth < 768 ? 10 : 12
                },
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
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                title: {
                  display: window.innerWidth >= 640,
                  text: 'Overall duration in days (Total ~247 Days)',
                  font: {
                    size: window.innerWidth < 768 ? 10 : 13,
                    weight: '500'
                  }
                },
                ticks: {
                  font: {
                    size: window.innerWidth < 768 ? 9 : 11
                  }
                }
              },
              y: {
                stacked: true,
                grid: {
                  display: false
                },
                ticks: {
                  display: window.innerWidth >= 640,
                  font: {
                    size: window.innerWidth < 768 ? 8 : 11
                  }
                }
              },
            },
          },
        });
      }
    }
  }, [resultsVisible]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 flex flex-col">
  <Header />
  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-8 flex-grow">
    {/* Hero Section */}
    <div className="text-center mb-6 sm:mb-12">
      <div className="flex justify-center mb-3 sm:mb-6">
        <div className="p-2 sm:p-4 bg-amber-100 rounded-2xl shadow-lg">
          <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
        </div>
      </div>
      <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
        Construction Cost Calculator
      </h2>
      <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
        Get accurate construction cost estimates for your dream home project
      </p>
    </div>

    {/* Input Form Card */}
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 mb-4 sm:mb-8 overflow-hidden">
      <div className="p-3 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          {/* State Selection */}
          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
              State
            </label>
            <select
              className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400"
              value={state}
              onChange={handleStateChange}
            >
              <option value="">Select State</option>
              {Object.keys(cityMap).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
              City
            </label>
            <select
              className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400 disabled:bg-gray-50"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state}
            >
              <option value="">Select City</option>
              {(cityMap[state] || []).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Area Input */}
          <div className="space-y-1 sm:space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              <Layout className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
              Area
            </label>
            <input
              type="number"
              className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              placeholder="Enter area"
            />
          </div>
        </div>

        {/* Area Unit Selection & Button */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-3">
          <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-6">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="areaUnit" value="sqft" defaultChecked className="mr-1 sm:mr-2 text-amber-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Sq. Feet</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="areaUnit" value="sqm" className="mr-1 sm:mr-2 text-amber-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Sq. Meter</span>
            </label>
          </div>
          
          <button
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all font-semibold flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-base"
            onClick={calculateCost}
          >
            <span>Calculate Cost</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>

    {!resultsVisible && (
      <div className="flex flex-col items-center justify-center py-8 sm:py-20 text-gray-400">
        <div className="mb-3 sm:mb-4">
          <FileText className="w-8 h-8 sm:w-12 sm:h-12" />
        </div>
        <p className="text-sm sm:text-xl font-medium text-center px-2 sm:px-4">Enter details to generate your cost estimate</p>
      </div>
    )}

    {resultsVisible && (
      <div className="space-y-4 sm:space-y-8 w-full overflow-hidden">
        {/* Charts Section - Now with constrained width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 w-full">
          {/* Cost Breakdown Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 p-3 sm:p-6 w-full">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-6 text-center">
              Cost Breakdown
            </h3>
            <div className="relative w-full h-48 sm:h-80">
              <canvas 
                ref={doughnutChartRef}
                className="!w-full !h-full"
              />
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 p-3 sm:p-6 w-full">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3 sm:mb-6 text-center">
              Project Timeline
            </h3>
          <div className="relative w-full h-48 sm:h-80">
            <canvas 
              ref={barChartRef}
              className="!w-full !h-full"
            />
          </div>
          </div>
        </div>

        {/* Resource Allocation Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-3 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 text-center">
              Resource Allocation
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full sm:min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-900">Resource</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-900">Quantity</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-semibold text-gray-900">Quality</th>
                  <th className="px-2 sm:px-6 py-2 sm:py-4 text-right text-xs font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {baseResources.map(({ resource, quantity, baseAmount }, index) => {
                  const quality = resourceQualities[resource] || 'Basic';
                  const amount = getAmount(baseAmount, quality);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center">
                          {resourceIcons[resource]}
                          <span className="font-medium text-gray-900 text-xs sm:text-sm ml-1">{resource}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600 text-xs sm:text-sm">{quantity}</td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          {['Basic', 'Medium', 'Premium'].map((q) => (
                            <label key={q} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`${resource}-quality`}
                                value={q}
                                checked={quality === q}
                                onChange={() => handleQualityChange(resource, q)}
                                className="mr-1 text-amber-500"
                              />
                              <span className={`text-xs font-medium ${quality === q ? 'text-amber-600' : 'text-gray-600'}`}>
                                {q}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4 text-right font-semibold text-gray-900 text-xs sm:text-sm">
                        ₹{amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-amber-200 p-3 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 text-center">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm">
              <div className="text-lg sm:text-2xl font-bold text-amber-600 mb-1 sm:mb-2">₹{costPerSqft.toLocaleString()}</div>
              <div className="text-gray-600 font-medium text-xs sm:text-base">Cost per sq ft</div>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm">
              <div className="text-lg sm:text-2xl font-bold text-amber-600 mb-1 sm:mb-2">₹{totalAmount.toLocaleString()}</div>
              <div className="text-gray-600 font-medium text-xs sm:text-base">Total Estimated Cost</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3 px-2 sm:px-0">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg font-semibold flex items-center justify-center space-x-1 text-xs sm:text-base"
          >
            <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Print Report</span>
          </button>
          <button 
            onClick={toggleShareModal}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg font-semibold flex items-center justify-center space-x-1 text-xs sm:text-base"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Share Estimate</span>
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleShareModal}></div>
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 z-10 shadow-xl w-full max-w-sm">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Share Your Estimate</h3>
                <p className="text-sm text-gray-600 mb-6">Send your construction cost estimate</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="text-xs text-gray-600 mb-1">Estimate Summary</div>
                  <div className="text-base font-bold text-gray-800">₹{totalAmount.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">
                    {state}, {city} • {area} sq ft • ₹{costPerSqft.toLocaleString()}/sqft
                  </div>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  <FacebookShareButton
                    url={window.location.href}
                    quote={`Construction estimate: ₹${totalAmount.toLocaleString()} • ${area} sq ft @ ₹${costPerSqft}/sqft • ${city}, ${state}`}
                    hashtag="#ConstructionEstimate"
                  >
                    <FacebookIcon size={40} round />
                  </FacebookShareButton>

                  <TwitterShareButton
                    url={window.location.href}
                    title={`Construction estimate: ₹${totalAmount.toLocaleString()} • ${area} sq ft @ ₹${costPerSqft}/sqft • ${city}, ${state}`}
                  >
                    <TwitterIcon size={40} round />
                  </TwitterShareButton>

                  <WhatsappShareButton
                    url={window.location.href}
                    title={`Construction estimate: ₹${totalAmount.toLocaleString()} • ${area} sq ft @ ₹${costPerSqft}/sqft • ${city}, ${state}`}
                    separator=" - "
                  >
                    <WhatsappIcon size={40} round />
                  </WhatsappShareButton>

                  <LinkedinShareButton
                    url={window.location.href}
                    summary={`Detailed construction cost estimate: ₹${totalAmount.toLocaleString()} for ${area} sq ft at ₹${costPerSqft}/sqft in ${city}, ${state}`}
                    source="Construction Cost Calculator"
                  >
                    <LinkedinIcon size={40} round />
                  </LinkedinShareButton>
                </div>

                <button
                  onClick={toggleShareModal}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
  <Footer />
</div>
  );
};

export default CostCalc;