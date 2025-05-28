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
  Banknote,
  ChevronDown,
  Sparkles
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
  const [showTable, setShowTable] = useState(false);

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
        type: 'doughnut',
        data: {
          labels: ['Principal Loan Amount', 'Total Interest'],
          datasets: [
            {
              data: [loanAmount, totalInterest],
              backgroundColor: ['#fbbf24', '#3b82f6'],
              borderWidth: 0,
              cutout: '60%',
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
                color: '#374151',
                font: { size: 12, weight: '500' },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
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
        
        if (month % 12 === 0 || month === 1) {
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
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#fbbf24',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2
            },
            {
              label: 'Interest Payment',
              data: data.map(d => d.interest),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { 
                color: '#374151',
                font: { size: 12, weight: '500' },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: { 
                color: '#6b7280',
                callback: function(value) {
                  return '₹' + (value/1000).toFixed(0) + 'K';
                }
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
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
            borderRadius: 8,
            borderSkipped: false,
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
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: { 
                color: '#6b7280',
                callback: function(value) {
                  return '₹' + (value/1000).toFixed(0) + 'K';
                }
              }
            },
            x: {
              grid: {
                display: false
              },
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

  const interestPercentage = ((totalInterest / loanAmount) * 100).toFixed(1);
  const monthsToPayoff = loanTenure * 12;
  const breakEvenMonth = Math.ceil(monthsToPayoff / 2);
  const yearlySavings = emi * 12;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Modern Header */}
      <Header />
      <div className="flex flex-col items-center text-center gap-4 py-10">
        <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg">
          <Banknote className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            EMI Calculator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-2">
            Smart loan planning made simple
          </p>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Input Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 font-semibold text-gray-700">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-yellow-600" />
                </div>
                Loan Amount
              </label>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">₹{(tempLoanAmount / 100000).toFixed(1)}L</div>
                <div className="text-xs text-gray-500">in Lakhs</div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={tempLoanAmount / 100000}
              onChange={(e) => setTempLoanAmount(Number(e.target.value) * 100000)}
              onMouseUp={commitLoanAmount}
              onTouchEnd={commitLoanAmount}
              className="w-full h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(tempLoanAmount / 100000 - 1) / 99 * 100}%, #e5e7eb ${(tempLoanAmount / 100000 - 1) / 99 * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹1L</span>
              <span>₹100L</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 font-semibold text-gray-700">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                Interest Rate
              </label>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{tempInterestRate}%</div>
                <div className="text-xs text-gray-500">per annum</div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={0.1}
              value={tempInterestRate}
              onChange={(e) => setTempInterestRate(Number(e.target.value))}
              onMouseUp={commitInterestRate}
              onTouchEnd={commitInterestRate}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(tempInterestRate - 1) / 19 * 100}%, #e5e7eb ${(tempInterestRate - 1) / 19 * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 font-semibold text-gray-700">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-green-600" />
                </div>
                Loan Tenure
              </label>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{tempLoanTenure}</div>
                <div className="text-xs text-gray-500">years</div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tempLoanTenure}
              onChange={(e) => setTempLoanTenure(Number(e.target.value))}
              onMouseUp={commitLoanTenure}
              onTouchEnd={commitLoanTenure}
              className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(tempLoanTenure - 1) / 29 * 100}%, #e5e7eb ${(tempLoanTenure - 1) / 29 * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 year</span>
              <span>30 years</span>
            </div>
          </div>
        </section>

        {/* Modern EMI Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100/50 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-yellow-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-yellow-200/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-6 h-6 text-yellow-700" />
              </div>
              <Sparkles className="w-5 h-5 text-yellow-600 opacity-60" />
            </div>
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Monthly EMI</h3>
            <p className="text-3xl font-bold text-yellow-700 mb-1">₹{emi.toLocaleString()}</p>
            <p className="text-xs text-yellow-600">For {loanTenure} years</p>
          </div>

          <div className="group bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-200/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-blue-700" />
              </div>
              <Sparkles className="w-5 h-5 text-blue-600 opacity-60" />
            </div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">Total Interest</h3>
            <p className="text-3xl font-bold text-blue-700 mb-1">₹{totalInterest.toLocaleString()}</p>
            <p className="text-xs text-blue-600">{interestPercentage}% of loan</p>
          </div>

          <div className="group bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-green-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-200/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
              <Sparkles className="w-5 h-5 text-green-600 opacity-60" />
            </div>
            <h3 className="text-sm font-medium text-green-800 mb-2">Total Payment</h3>
            <p className="text-3xl font-bold text-green-700 mb-1">₹{totalPayment.toLocaleString()}</p>
            <p className="text-xs text-green-600">Over {loanTenure} years</p>
          </div>

          <div className="group bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-purple-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-200/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <PiggyBank className="w-6 h-6 text-purple-700" />
              </div>
              <Sparkles className="w-5 h-5 text-purple-600 opacity-60" />
            </div>
            <h3 className="text-sm font-medium text-purple-800 mb-2">Annual Outflow</h3>
            <p className="text-3xl font-bold text-purple-700 mb-1">₹{yearlySavings.toLocaleString()}</p>
            <p className="text-xs text-purple-600">12 EMI payments</p>
          </div>
        </section>

        {/* Key Insights - Redesigned */}
        <section className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/50 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl">
              <Info className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Key Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-blue-800">Interest Impact</h4>
              </div>
              <p className="text-sm text-blue-700 leading-relaxed">
                You'll pay <span className="font-bold text-blue-900">₹{totalInterest.toLocaleString()}</span> extra as interest, 
                which is <span className="font-bold text-blue-900">{interestPercentage}%</span> more than your loan amount.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-2xl border border-green-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-green-800">Break-even Point</h4>
              </div>
              <p className="text-sm text-green-700 leading-relaxed">
                After <span className="font-bold text-green-900">{Math.ceil(breakEvenMonth/12)} years</span>, you'll have paid off 
                approximately 50% of your total loan amount.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-6 rounded-2xl border border-yellow-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h4 className="font-semibold text-yellow-800">Monthly Commitment</h4>
              </div>
              <p className="text-sm text-yellow-700 leading-relaxed">
                Your EMI of <span className="font-bold text-yellow-900">₹{emi.toLocaleString()}</span> represents a significant 
                monthly commitment for <span className="font-bold text-yellow-900">{loanTenure} years</span>.
              </p>
            </div>
          </div>
        </section>

        {/* Charts Section - Enhanced */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Loan Breakdown</h3>
            </div>
            <div className="w-full h-80">
              <canvas ref={pieChartRef} />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Payment Trend</h3>
            </div>
            <div className="w-full h-80">
              <canvas ref={lineChartRef} />
            </div>
          </div>
        </section>

        {/* Comparison Scenarios */}
        <section className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/50 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">EMI Comparison Scenarios</h3>
          </div>
          <div className="w-full h-80 mb-4">
            <canvas ref={barChartRef} />
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
            💡 Compare how changes in interest rate and loan tenure affect your monthly EMI
          </p>
        </section>

        {/* Modern Table Section */}
        <section className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden mb-10">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">EMI Payment Schedule</h3>
                <p className="text-sm text-gray-600 mt-1">Year-wise breakdown of your loan payments</p>
              </div>
              <button
                onClick={() => setShowTable(!showTable)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {showTable ? 'Hide' : 'Show'} Details
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showTable ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Year</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">Principal</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">Interest</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">Balance</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-700">Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {getEMITable().map((row, idx) => (
                    <tr key={idx} className="hover:bg-yellow-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{row.year}</td>
                      <td className="px-6 py-4 text-right text-gray-700">₹{row.principal.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-gray-700">₹{row.interest.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">₹{row.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-gray-600">₹{row.balance.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${row.paidPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-blue-600 min-w-[3rem]">
                            {row.paidPercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Modern Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => window.print()}
            className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <Printer className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Print Report
          </button>
          <button
            onClick={toggleShareModal}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Share Results
          </button>
        </div>
      </div>

      {/* Enhanced Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={toggleShareModal}
          ></div>
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50 max-w-md w-full transform scale-100 animate-in">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Your Estimate</h3>
              <p className="text-gray-600 mb-6">Share your EMI calculation results</p>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">Your EMI Summary</div>
                <div className="text-lg font-bold text-gray-800">₹{emi.toLocaleString()}/month</div>
                <div className="text-sm text-gray-600">
                  ₹{(loanAmount/100000).toFixed(1)}L loan • {interestRate}% rate • {loanTenure} years
                </div>
              </div>

              <div className="flex justify-center gap-3 mb-6">
                <button className="p-3 bg-blue-100 hover:bg-blue-200 rounded-2xl transition-colors group">
                  <Share2 className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <button
                onClick={toggleShareModal}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: 3px solid white;
          transition: all 0.2s ease;
        }
        
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default EMICalculator;