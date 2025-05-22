// Improved EMI Calculator UI (sleek modern look, no animations)
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Header from './Header';
import Footer from './Footer';

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

import { Printer, Share2, IndianRupee, Percent, CalendarDays } from 'lucide-react';

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
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { color: '#000' },
            },
          },
        },
      });
    }
  }, [loanAmount, totalInterest]);

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

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
      <Header />
      <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-6 mt-24 border border-gray-300/50 rounded-md bg-gray-100/20 drop-shadow-xs mb-10">
        <h1 className="text-5xl font-extrabold text-center mb-13 mt-4">EMI Calculator</h1>

        {/* Sliders */}
        <section className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Loan Amount Slider */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <label className="block mb-2 font-semibold text-gray-700">
              <IndianRupee className="inline w-5 h-5 mr-1" /> Loan Amount (₹ Lakhs)
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
            <div className="mt-2 text-center text-lg font-semibold">
              {tempLoanAmount / 100000} Lakh
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <label className="block mb-2 font-semibold text-gray-700">
              <Percent className="inline w-5 h-5 mr-1" /> Interest Rate (%)
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
            <div className="mt-2 text-center text-lg font-semibold">
              {tempInterestRate}%
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <label className="block mb-2 font-semibold text-gray-700">
              <CalendarDays className="inline w-5 h-5 mr-1" /> Loan Tenure (Years)
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
            <div className="mt-2 text-center text-lg font-semibold">
              {tempLoanTenure} Years
            </div>
          </div>
        </section>

        {/* EMI Summary */}
        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-extrabold mb-4 text-gray-800 tracking-tight">Loan EMI</h2>
            <p className="text-4xl font-bold mb-3 text-yellow-600">₹{emi.toLocaleString()}</p>
            <p className="text-lg text-gray-700 mb-1">Total Interest: <span className="font-medium text-blue-600">₹{totalInterest.toLocaleString()}</span></p>
            <p className="text-lg text-gray-700">Total Payment: <span className="font-medium text-green-600">₹{totalPayment.toLocaleString()}</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex justify-center">
            <canvas ref={pieChartRef} width={500} height={400} />
          </div>
        </section>

        {/* Table */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <h3 className="text-lg font-semibold bg-gray-300 p-4">EMI Schedule</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-200 text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="p-3 text-left">Year</th>
                  <th className="p-3 text-right">Principal</th>
                  <th className="p-3 text-right">Interest</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-right">Balance</th>
                  <th className="p-3 text-right">Paid</th>
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
                    <td className="p-3 font-medium">{row.year}</td>
                    <td className="p-3 text-right">₹{row.principal.toLocaleString()}</td>
                    <td className="p-3 text-right">₹{row.interest.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold">₹{row.total.toLocaleString()}</td>
                    <td className="p-3 text-right text-gray-600">₹{row.balance.toLocaleString()}</td>
                    <td className="p-3 text-right text-blue-600">{row.paidPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
          
          </div>
      </div>
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
      <Footer />
    </div>
  );
};

export default EMICalculator;
