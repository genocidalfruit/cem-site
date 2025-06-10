import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import { Printer, Share2, FileText, ChevronRight, Calculator, MapPin, Home, Mail } from 'lucide-react';

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

import Header from './Header'; // Assuming Header component exists
import Footer from './Footer'; // Assuming Footer component exists

const CostCalc = () => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState(5000);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [resourceQualities, setResourceQualities] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fetchedResources, setFetchedResources] = useState([]);
  const [costBreakdownData, setCostBreakdownData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [costPerSqft, setCostPerSqft] = useState(0);

  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);

  const resourceIcons = {
    Aggregate: <Layers className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Bricks: <Cuboid className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Cement: <Truck className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Doors: <DoorOpen className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    'Electrical fittings': <Zap className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Flooring: <Layout className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Painting: <Paintbrush className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Sand: <Waves className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Steel: <Hammer className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
    Windows: <Grid2X2 className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />,
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handlePincodeChange = async (e) => {
    const inputPincode = e.target.value;
    setPincode(inputPincode);

    if (inputPincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${inputPincode}`);
        const data = await response.json();

        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setState(postOffice.State);
          setCity(postOffice.District);
        } else {
          setError('Invalid pincode or no data found for this pincode.');
          // Do not clear state/city here if we want them to be manually editable
          // setState('');
          // setCity('');
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        setError('Failed to fetch pincode data. Please try again.');
      }
    } else if (inputPincode.length < 6) {
      // Do not clear state/city here if we want them to be manually editable
      // setState('');
      // setCity('');
      setError(null);
    }
  };

  const fetchResourceData = async (pincode) => {
    try {
      const response = await fetch(`https://cem-site-api.onrender.com/api/resources/${pincode}`);
      if (!response.ok) {
        throw new Error(`Error fetching resources: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch resources with success: false');
      }
      const data = result.data;
      setFetchedResources(data);

      setResourceQualities(prevQualities => {
        const newQualities = { ...prevQualities };
        data.forEach(resource => {
          if (!newQualities[resource.resource]) {
            const availableQualities = Object.keys(resource).filter(key =>
              ['basic', 'medium', 'premium'].includes(key)
            );
            newQualities[resource.resource] = availableQualities.includes('basic') ? 'basic' : availableQualities[0];
          }
        });
        return newQualities;
      });
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError("Failed to load resource data. Please try again.");
      setFetchedResources([]);
    }
  };

  const fetchCostBreakdownData = async (pincode) => {
    try {
      const response = await fetch(`https://cem-site-api.onrender.com/api/charts/cost-breakdown/${pincode}`);
      if (!response.ok) {
        throw new Error(`Error fetching cost breakdown: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch cost breakdown with success: false');
      }
      setCostBreakdownData(result.data);
    } catch (err) {
      console.error("Failed to fetch cost breakdown:", err);
      setError("Failed to load cost breakdown data. Please try again.");
      setCostBreakdownData([]);
    }
  };

  const fetchTimelineChartData = async (pincode) => {
    try {
      const response = await fetch(`https://cem-site-api.onrender.com/api/charts/timeline/${pincode}`);
      if (!response.ok) {
        throw new Error(`Error fetching timeline data: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch timeline data with success: false');
      }
      setTimelineData(result.data);
    } catch (err) {
      console.error("Failed to fetch timeline data:", err);
      setError("Failed to load timeline data. Please try again.");
      setTimelineData([]);
    }
  };

  const calculateCost = async (triggerFullRecalculation = true) => {
    if (!state || !city || !area || !pincode) {
      setError('Please complete all inputs: State, City, Pincode, and Area.');
      return;
    }

    if (triggerFullRecalculation) {
      setLoading(true);
      setError(null);
      setResultsVisible(false); // Hide results while calculating
    }

    try {
      if (triggerFullRecalculation) {
        await fetchResourceData(pincode);
      }

      const qualitySelections = {};
      fetchedResources.forEach(resource => {
        qualitySelections[resource.resource] = resourceQualities[resource.resource] || 'basic';
      });

      const response = await fetch('https://cem-site-api.onrender.com/api/resources/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode, area, qualitySelections }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Calculation failed: ${response.statusText}. Details: ${errorBody.message || 'Unknown error'}`);
      }

      const calculationResult = await response.json();
      if (!calculationResult.success) {
        throw new Error(calculationResult.message || 'Calculation failed with success: false');
      }

      setTotalAmount(calculationResult.data.totalAmount);
      setCostPerSqft(calculationResult.data.costPerSqft);
      setResultsVisible(true);

      if (triggerFullRecalculation) {
        await fetchCostBreakdownData(pincode);
        await fetchTimelineChartData(pincode);
      }

    } catch (err) {
      console.error('Error during cost calculation:', err);
      setError(`Failed to calculate cost. Please check your inputs and try again. Error: ${err.message}`);
      setResultsVisible(false);
    } finally {
      if (triggerFullRecalculation) {
        setLoading(false);
      }
    }
  };

  const handleQualityChange = async (resourceName, quality) => {
    setResourceQualities((prev) => ({
      ...prev,
      [resourceName]: quality,
    }));

    if (resultsVisible) {
      await calculateCost(false);
    }
  };

  const toggleShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  // Chart rendering useEffect
  useEffect(() => {
    if (!resultsVisible) return;

    if (doughnutChartRef.current && doughnutChartRef.current.chart) {
      doughnutChartRef.current.chart.destroy();
      doughnutChartRef.current.chart = null;
    }
    if (barChartRef.current && barChartRef.current.chart) {
      barChartRef.current.chart.destroy();
      barChartRef.current.chart = null;
    }

    if (costBreakdownData.length > 0) {
      if (doughnutChartRef.current) {
        const ctx1 = doughnutChartRef.current.getContext('2d');
        doughnutChartRef.current.chart = new Chart(ctx1, {
          type: 'doughnut',
          data: {
            labels: costBreakdownData.map(item => item.label),
            datasets: [
              {
                data: costBreakdownData.map(item => item.percentage),
                backgroundColor: costBreakdownData.map(item => item.color),
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
    }

    if (timelineData.length > 0) {
      if (barChartRef.current) {
        const ctx2 = barChartRef.current.getContext('2d');
        barChartRef.current.chart = new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: timelineData.map(item => item.label),
            datasets: [
              {
                label: 'Offset',
                data: timelineData.map(item => item.offset),
                backgroundColor: 'transparent',
                barPercentage: 0.8,
                categoryPercentage: 0.8,
              },
              {
                label: 'Duration',
                data: timelineData.map(item => item.duration),
                backgroundColor: '#F59E0B',
                borderRadius: 4,
                barPercentage: 0.8,
                categoryPercentage: 0.8,
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
                    const duration = timelineData[index].duration;
                    const cost = timelineData[index].cost;
                    return `${duration} Days | Cost: ₹${cost?.toLocaleString() || 'N/A'}`;
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
                  text: `Overall duration in days (Total ~${timelineData.reduce((sum, item) => sum + item.duration, 0)} Days)`,
                  font: {
                    size: window.innerWidth < 768 ? 10 : 13,
                    weight: '500'
                  }
                },
                ticks: {
                  font: {
                    size: window.innerWidth < 768 ? 9 : 11
                  },
                  beginAtZero: true,
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
  }, [resultsVisible, costBreakdownData, timelineData]);


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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
              {/* Pincode Input */}
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
                  Pincode
                </label>
                <input
                  type="text"
                  className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400"
                  value={pincode}
                  onChange={handlePincodeChange}
                  placeholder="Enter 6-digit Pincode"
                  maxLength="6"
                />
              </div>

              {/* State Input - Now editable, but still affected by Pincode API */}
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
                  State
                </label>
                <input
                  type="text"
                  className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400"
                  value={state}
                  onChange={handleStateChange}
                  placeholder="Enter State"
                  // Removed readOnly
                />
              </div>

              {/* City Input - Now editable, but still affected by Pincode API */}
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
                  City
                </label>
                <input
                  type="text"
                  className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400"
                  value={city}
                  onChange={handleCityChange}
                  placeholder="Enter City"
                  // Removed readOnly
                />
              </div>

              {/* Area Input */}
              <div className="space-y-1 sm:space-y-2">
                <label className="flex items-center text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  <Layout className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-amber-500" />
                  Area (Sq. Ft.)
                </label>
                <input
                  type="number"
                  className="w-full p-2 sm:p-4 text-xs sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-amber-400"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  placeholder="Enter area in Sq. Ft."
                />
              </div>
            </div>

            {/* Calculate Button - Area Unit Selector Removed */}
            <div className="flex justify-center"> {/* This class will center the button */}
              <button
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all font-semibold flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-base"
                onClick={() => calculateCost(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <span>Calculate Cost</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
            )}
          </div>
        </div>

        {!resultsVisible && !loading && (
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
                    {fetchedResources.map((item, index) => {
                      const resourceName = item.resource;
                      const selectedQuality = resourceQualities[resourceName] || 'basic';

                      const quantity = item[selectedQuality]?.quantity || 'N/A';
                      const amount = item[selectedQuality]?.price || 0;

                      const availableQualities = Object.keys(item).filter(key =>
                        ['basic', 'medium', 'premium'].includes(key) && item[key]
                      );

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex items-center">
                              {resourceIcons[resourceName]}
                              <span className="font-medium text-gray-900 text-xs sm:text-sm ml-1">{resourceName}</span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-600 text-xs sm:text-sm">{quantity}</td>
                          <td className="px-2 sm:px-6 py-2 sm:py-4">
                            <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                              {availableQualities.map((q) => (
                                <label key={q} className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`${resourceName}-quality`}
                                    value={q}
                                    checked={selectedQuality === q}
                                    onChange={() => handleQualityChange(resourceName, q)}
                                    className="mr-1 text-amber-500"
                                  />
                                  <span className={`text-xs font-medium ${selectedQuality === q ? 'text-amber-600' : 'text-gray-600'}`}>
                                    {q.charAt(0).toUpperCase() + q.slice(1)}
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
                        {state}, {city} • {area} sq ft • ₹{costPerSqft.toLocaleString()}/sqft • Pincode: {pincode}
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 mb-6">
                      <FacebookShareButton
                        url={window.location.href}
                        quote={`Construction estimate: ₹${totalAmount.toLocaleString()} • ${area} sq ft @ ₹${costPerSqft}/sqft • ${city}, ${state} (Pincode: ${pincode})`}
                        hashtag="#ConstructionEstimate"
                      >
                        <FacebookIcon size={40} round />
                      </FacebookShareButton>

                      <TwitterShareButton
                        url={window.location.href}
                        title={`Construction estimate: ₹${totalAmount.toLocaleString()} • ${area} sq ft @ ₹${costPerSqft}/sqft • ${city}, ${state} (Pincode: ${pincode})`}
                      >
                        <TwitterIcon size={40} round />
                      </TwitterShareButton>

                      <WhatsappShareButton
                        url={window.location.href}
                        title={`Construction estimate: ₹${totalAmount.toLocaleString()} • ${area} sq ft @ ₹${costPerSqft}/sqft • ${city}, ${state} (Pincode: ${pincode})`}
                        separator=" - "
                      >
                        <WhatsappIcon size={40} round />
                      </WhatsappShareButton>

                      <LinkedinShareButton
                        url={window.location.href}
                        summary={`Detailed construction cost estimate: ₹${totalAmount.toLocaleString()} for ${area} sq ft at ₹${costPerSqft}/sqft in ${city}, ${state} (Pincode: ${pincode})`}
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