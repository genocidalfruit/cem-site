import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

import { FileText } from 'lucide-react';

const stateCityMap = {
  Karnataka: ['Kundapura', 'Bangalore', 'Mysore'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara']
};

const StoreLocator = () => {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [supplier, setSupplier] = useState(null);

  const handleSubmit = () => {
    if (state && city) {
      // Mocked data
      setSupplier({
        name: 'SKS TRADERS',
        contact: '9448348540 / 9448348540',
        address: 'KANCHIKAN,II 72-2,BIJOOR POST,KUNDAPURA TQ,UDUPI 576224',
        pincode: '576244'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white">
      <Header />
      <div className='flex-grow border border-gray-300/50 rounded-md bg-gray-100/20 drop-shadow-xs m-10 mt-28'>
        <main className="px-6 max-w-5xl mx-auto text-center mt-10">
          <h1 className="text-4xl font-extrabold mb-10">Store Locator</h1>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity('');
                setSupplier(null);
              }}
              className="w-60 p-2 border border-gray-300 rounded-md shadow-sm text-gray-800 font-semibold bg-gray-100"
            >
              <option value="">Select State</option>
              {Object.keys(stateCityMap).map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-60 p-2 border border-gray-300 rounded-md shadow-sm text-gray-800 font-semibold bg-gray-100"
            >
              <option value="">Select City</option>
              {(stateCityMap[state] || []).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              className="bg-yellow-400 hover:bg-yellow-300 px-6 py-2 font-bold rounded-md text-black shadow"
            >
              Submit
            </button>
          </div>

          {!supplier && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FileText className="w-10 h-10 mb-4" />
              <p className="text-lg font-medium">Select state and city to find your supplier</p>
            </div>
          )}

          {supplier && (
            <div className="max-w-xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow bg-gray-50">
              <div className="bg-yellow-300/80 text-black font-bold py-3 text-center text-lg">
                {supplier.name}
              </div>
              <div className="p-5 text-left text-gray-800 space-y-2">
                <p>
                  <span className="font-semibold">Contact No</span>: {supplier.contact}
                </p>
                <p>
                  <span className="font-semibold">Address</span>: {supplier.address}
                </p>
                <p>
                  <span className="font-semibold">Pincode</span>: {supplier.pincode}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StoreLocator;
