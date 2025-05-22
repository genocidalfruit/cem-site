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

import { Printer, Share2 } from 'lucide-react';

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1500000); // in ₹
  const [interestRate, setInterestRate] = useState(10); // %
  const [loanTenure, setLoanTenure] = useState(10); // years

  const pieChartRef = useRef(null);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const [showShareModal, setShowShareModal] = useState(false);
  const toggleShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  useEffect(() => {
    const monthlyRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emiCalc =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
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
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
              },
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
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
      <Header />
      <div className="flex-grow">
        <div className="mt-24 max-w-6xl mx-auto bg-gray-100 p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">EMI Calculator for Home Loan</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="font-semibold">Home Loan Amount (₹) in Lakhs</label>
              <input
                type="range"
                min={1}
                max={100}
                value={loanAmount / 100000}
                onChange={(e) => setLoanAmount(Number(e.target.value) * 100000)}
                className="w-full accent-yellow-400"
              />
              <div className="bg-white p-2 rounded text-center font-semibold">
                ₹{(loanAmount / 100000).toLocaleString()} Lakh
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold">Interest Rate (%)</label>
              <input
                type="range"
                min={1}
                max={20}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="bg-white p-2 rounded text-center font-semibold">{interestRate}%</div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold">Loan Tenure (Years)</label>
              <input
                type="range"
                min={1}
                max={30}
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <div className="bg-white p-2 rounded text-center font-semibold">{loanTenure} Years</div>
            </div>
          </div>
        </div>

        {/* Result Chart */}
        <div className="bg-gray-800 text-white mt-8 p-8 rounded-md max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Loan EMI</h3>
              <p className="text-2xl font-semibold mb-2">₹{emi.toLocaleString()}</p>
              <p className="mb-2">Total Interest Payable: ₹{totalInterest.toLocaleString()}</p>
              <p>Total Payment: ₹{totalPayment.toLocaleString()}</p>
            </div>
            <div>
              <canvas ref={pieChartRef} />
            </div>
          </div>
        </div>

        {/* EMI Table */}
        <div className="bg-white max-w-6xl mx-auto mt-10">
          <h3 className="text-lg font-semibold bg-gray-800 text-white p-4 rounded-t">
            Schedule showing EMI payments starting from
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="p-2 border">Year</th>
                <th className="p-2 border">Principal Table (A)</th>
                <th className="p-2 border">Interest Table (B)</th>
                <th className="p-2 border">Total Payment (A+B)</th>
                <th className="p-2 border">Balance</th>
                <th className="p-2 border">Loan Paid To Date</th>
              </tr>
            </thead>
            <tbody>
              {getEMITable().map((row, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border p-2">[+] {row.year}</td>
                  <td className="border p-2">₹{row.principal.toLocaleString()}</td>
                  <td className="border p-2">₹{row.interest.toLocaleString()}</td>
                  <td className="border p-2">₹{row.total.toLocaleString()}</td>
                  <td className="border p-2">₹{row.balance.toLocaleString()}</td>
                  <td className="border p-2">{row.paidPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Print and Share Buttons */}
          <div className="flex justify-center gap-4 py-6 print:hidden">
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
      </div>
      <Footer />
    </div>
  );
};

export default EMICalculator;
