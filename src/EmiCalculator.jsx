import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  Printer, 
  Share2, 
  IndianRupee, 
  Percent, 
  CalendarDays, 
  TrendingUp, 
  PiggyBank, 
  Calculator,
  Info,
  BarChart3,
  DollarSign,
  Banknote
} from 'lucide-react';

import Header from './Header';
import Footer from './Footer';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTenure, setLoanTenure] = useState(10);

  // Temporary state for sliders
  const [tempLoanAmount, setTempLoanAmount] = useState(loanAmount);
  const [tempInterestRate, setTempInterestRate] = useState(interestRate);
  const [tempLoanTenure, setTempLoanTenure] = useState(loanTenure);

  // Handlers to commit the values on slider release
  const commitLoanAmount = () => setLoanAmount(tempLoanAmount);
  const commitInterestRate = () => setInterestRate(tempInterestRate);
  const commitLoanTenure = () => setLoanTenure(tempLoanTenure);

  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  const toggleShareModal = () => setShowShareModal(!showShareModal);

  useEffect(() => {
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emiCalc = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const total = emiCalc * months;
    const interest = total - loanAmount;

    setEmi(Math.round(emiCalc));
    setTotalInterest(Math.round(interest));
    setTotalPayment(Math.round(total));
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(() => {
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      if (Chart.getChart(pieChartRef.current)) {
        Chart.getChart(pieChartRef.current).destroy();
      }
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Principal Loan Amount', 'Total Interest'],
          datasets: [
            {
              data: [loanAmount, totalInterest],
              backgroundColor: ['#fbbf24', '#3b82f6'],
              borderWidth: 2,
              borderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { 
                color: '#374151',
                font: { size: 12, weight: '500' },
                padding: 15
              },
            },
          },
        },
      });
    }
  }, [loanAmount, totalInterest]);

  // Line chart for payment breakdown over time
  useEffect(() => {
    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      if (Chart.getChart(lineChartRef.current)) {
        Chart.getChart(lineChartRef.current).destroy();
      }

      const monthlyRate = interestRate / 12 / 100;
      const months = loanTenure * 12;
      let balance = loanAmount;
      const data = [];

      for (let month = 1; month <= months; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = emi - interestPayment;
        balance -= principalPayment;
        
        if (month % 12 === 0 || month === 1) { // Show yearly data points
          data.push({
            year: Math.ceil(month / 12),
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(balance, 0)
          });
        }
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => `Year ${d.year}`),
          datasets: [
            {
              label: 'Principal Payment',
              data: data.map(d => d.principal),
              borderColor: '#fbbf24',
              backgroundColor: '#fbbf24',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Interest Payment',
              data: data.map(d => d.interest),
              borderColor: '#3b82f6',
              backgroundColor: '#3b82f6',
              fill: false,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { 
                color: '#374151',
                font: { size: 12, weight: '500' }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { 
                color: '#6b7280',
                callback: function(value) {
                  return '₹' + (value/1000).toFixed(0) + 'K';
                }
              }
            },
            x: {
              ticks: { color: '#6b7280' }
            }
          }
        }
      });
    }
  }, [loanAmount, interestRate, loanTenure, emi]);

  // Bar chart for comparison scenarios
  useEffect(() => {
    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      if (Chart.getChart(barChartRef.current)) {
        Chart.getChart(barChartRef.current).destroy();
      }

      // Calculate EMIs for different scenarios
      const scenarios = [
        { name: 'Current', rate: interestRate, tenure: loanTenure },
        { name: '-1% Rate', rate: interestRate - 1, tenure: loanTenure },
        { name: '+1% Rate', rate: interestRate + 1, tenure: loanTenure },
        { name: '-2 Years', rate: interestRate, tenure: Math.max(loanTenure - 2, 1) },
        { name: '+2 Years', rate: interestRate, tenure: loanTenure + 2 }
      ];

      const emisData = scenarios.map(scenario => {
        const monthlyRate = scenario.rate / 12 / 100;
        const months = scenario.tenure * 12;
        return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
      });

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: scenarios.map(s => s.name),
          datasets: [{
            label: 'Monthly EMI',
            data: emisData,
            backgroundColor: ['#fbbf24', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'],
            borderWidth: 0,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { 
                color: '#6b7280',
                callback: function(value) {
                  return '₹' + (value/1000).toFixed(0) + 'K';
                }
              }
            },
            x: {
              ticks: { color: '#6b7280' }
            }
          }
        }
      });
    }
  }, [loanAmount, interestRate, loanTenure]);

  const getEMITable = () => {
    const rows = [];
    let balance = totalPayment;
    let paidToDate = 0;

    for (let year = 1; year <= loanTenure; year++) {
      const principal = Math.round(loanAmount / loanTenure);
      const interest = Math.round(totalInterest / loanTenure);
      const total = principal + interest;
      balance -= total;
      paidToDate += total;
      rows.push({
        year: 2025 + year - 1,
        principal,
        interest,
        total,
        balance: Math.max(balance, 0),
        paidPercent: Math.min(((paidToDate / totalPayment) * 100).toFixed(2), 100),
      });
    }
    return rows;
  };

  // Calculate key insights
  const interestPercentage = ((totalInterest / loanAmount) * 100).toFixed(1);
  const monthsToPayoff = loanTenure * 12;
  const breakEvenMonth = Math.ceil(monthsToPayoff / 2);
  const yearlySavings = emi * 12;

  return (
    <div className="flex flex-col min-h-screen text-gray-800"
    style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a9a9a9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '40px 40px',
      }}>
      <Header />
      <div className="flex-grow w-full max-w-7xl mx-auto py-6 mt-25 md:mt-24 border-0 shadow-xl shadow-gray-600/50 rounded-md bg-gray-100/75 mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center flex items-center justify-center gap-3 mb-8 pb-10 md:mb-13 mt-2 md:mt-4 border-b border-gray-300/50">
          <Banknote className="w-7 h-7 md:w-9 md:h-9 text-yellow-600 relative top-[2px] mr-2" />
          EMI Calculator
        </h1>
        <div className='px-4 sm:px-6'>
        {/* Sliders */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          {/* Loan Amount Slider */}
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-gray-100">
            <label className="block mb-2 font-semibold text-sm md:text-base text-gray-700">
              <IndianRupee className="inline w-4 h-4 md:w-5 md:h-5 mr-1" /> Loan Amount (₹ Lakhs)
            </label>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={tempLoanAmount / 100000}
              onChange={(e) => setTempLoanAmount(Number(e.target.value) * 100000)}
              onMouseUp={commitLoanAmount}
              onTouchEnd={commitLoanAmount}
              className="w-full accent-yellow-400"
            />
            <div className="mt-2 text-center text-base md:text-lg font-semibold text-yellow-600">
              {tempLoanAmount / 100000} Lakh
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-gray-100">
            <label className="block mb-2 font-semibold text-sm md:text-base text-gray-700">
              <Percent className="inline w-4 h-4 md:w-5 md:h-5 mr-1" /> Interest Rate (%)
            </label>
            <input
              type="range"
              min={1}
              max={20}
              step={0.1}
              value={tempInterestRate}
              onChange={(e) => setTempInterestRate(Number(e.target.value))}
              onMouseUp={commitInterestRate}
              onTouchEnd={commitInterestRate}
              className="w-full accent-yellow-400"
            />
            <div className="mt-2 text-center text-base md:text-lg font-semibold text-blue-600">
              {tempInterestRate}%
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-gray-100">
            <label className="block mb-2 font-semibold text-sm md:text-base text-gray-700">
              <CalendarDays className="inline w-4 h-4 md:w-5 md:h-5 mr-1" /> Loan Tenure (Years)
            </label>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tempLoanTenure}
              onChange={(e) => setTempLoanTenure(Number(e.target.value))}
              onMouseUp={commitLoanTenure}
              onTouchEnd={commitLoanTenure}
              className="w-full accent-yellow-400"
            />
            <div className="mt-2 text-center text-base md:text-lg font-semibold text-green-600">
              {tempLoanTenure} Years
            </div>
          </div>
        </section>

        {/* Enhanced EMI Summary */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Monthly EMI</h3>
              <Calculator className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">₹{emi.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Per month for {loanTenure} years</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Total Interest</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">₹{totalInterest.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{interestPercentage}% of loan amount</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Total Payment</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">₹{totalPayment.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Over {loanTenure} years</p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Annual Outflow</h3>
              <PiggyBank className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">₹{yearlySavings.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">12 EMI payments/year</p>
          </div>
        </section>

        {/* Key Insights Section */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 mb-8 md:mb-10">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Key Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Interest Impact</h4>
              <p className="text-sm text-blue-700">
                You'll pay <strong>₹{totalInterest.toLocaleString()}</strong> extra as interest, 
                which is <strong>{interestPercentage}%</strong> more than your loan amount.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Break-even Point</h4>
              <p className="text-sm text-green-700">
                After <strong>{Math.ceil(breakEvenMonth/12)} years</strong>, you'll have paid off 
                approximately 50% of your total loan amount.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="font-semibold text-yellow-800 mb-2">Monthly Commitment</h4>
              <p className="text-sm text-yellow-700">
                Your EMI of <strong>₹{emi.toLocaleString()}</strong> represents a significant 
                monthly financial commitment for the next <strong>{loanTenure} years</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
          {/* Original Pie Chart */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Loan Breakdown</h3>
            </div>
            <div className="w-full h-64 md:h-80">
              <canvas ref={pieChartRef} />
            </div>
          </div>

          {/* Payment Trend Chart */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Payment Trend Over Time</h3>
            </div>
            <div className="w-full h-64 md:h-80">
              <canvas ref={lineChartRef} />
            </div>
          </div>
        </section>

        {/* Comparison Scenarios */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100 mb-8 md:mb-10">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">EMI Comparison Scenarios</h3>
          </div>
          <div className="w-full h-64 md:h-80">
            <canvas ref={barChartRef} />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Compare how changes in interest rate and loan tenure affect your monthly EMI
          </p>
        </section>

        {/* EMI Schedule Table */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gray-100 p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">EMI Payment Schedule</h3>
            <p className="text-sm text-gray-600 mt-1">Year-wise breakdown of your loan payments</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm text-gray-800">
              <thead className="bg-gray-200 text-gray-600 uppercase tracking-wide">
                <tr>
                  <th className="p-2 md:p-3 text-left">Year</th>
                  <th className="p-2 md:p-3 text-right">Principal</th>
                  <th className="p-2 md:p-3 text-right">Interest</th>
                  <th className="p-2 md:p-3 text-right">Total</th>
                  <th className="p-2 md:p-3 text-right">Balance</th>
                  <th className="p-2 md:p-3 text-right">Paid</th>
                </tr>
              </thead>
              <tbody>
                {getEMITable().map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-yellow-50`}
                  >
                    <td className="p-2 md:p-3 font-medium">{row.year}</td>
                    <td className="p-2 md:p-3 text-right">₹{row.principal.toLocaleString()}</td>
                    <td className="p-2 md:p-3 text-right">₹{row.interest.toLocaleString()}</td>
                    <td className="p-2 md:p-3 text-right font-semibold">₹{row.total.toLocaleString()}</td>
                    <td className="p-2 md:p-3 text-right text-gray-600">₹{row.balance.toLocaleString()}</td>
                    <td className="p-2 md:p-3 text-right">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {row.paidPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex justify-center space-x-3 md:space-x-4 mt-4 md:mt-6 pb-4 md:pb-5 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base transition-colors duration-200"
          >
            <Printer className="w-3 h-3 md:w-4 md:h-4" /> Print
          </button>
          <button
            onClick={toggleShareModal}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base transition-colors duration-200"
          >
            <Share2 className="w-3 h-3 md:w-4 md:h-4" /> Share
          </button>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={toggleShareModal}></div>
          <div className="bg-white rounded-lg p-4 md:p-6 z-10 shadow-xl mx-4 max-w-xs md:max-w-md w-full">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-center">Share Your Estimate</h3>
            <div className="flex justify-center space-x-3 md:space-x-4">
              <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={toggleShareModal}
              className="mt-4 md:mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1.5 md:py-2 px-4 rounded-md w-full font-semibold text-sm md:text-base transition-colors duration-200"
            >
              Close
            </button>
          </div>

        </div>
      )}
      </div>
    <Footer />
    </div>
  );
};

export default EMICalculator;