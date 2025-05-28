import React, { useState } from 'react';
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
  LinkedinIcon,
} from 'react-share';

import { Calculator, Printer, Share2 } from 'lucide-react';

const TileCalculator = () => {
  const [type, setType] = useState('floor');
  const [useCustom, setUseCustom] = useState(false);
  const [tileLength, setTileLength] = useState(600); // mm
  const [tileWidth, setTileWidth] = useState(600); // mm
  const [tileUnit, setTileUnit] = useState('mm');

  const [areaLength, setAreaLength] = useState(30);
  const [areaWidth, setAreaWidth] = useState(30);
  const [areaUnit, setAreaUnit] = useState('in');

  const [tilesPerBox, setTilesPerBox] = useState(10);
  const [tilePrice, setTilePrice] = useState(20);
  const [priceUnit, setPriceUnit] = useState('tile');

  const [showResult, setShowResult] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const toggleShareModal = () => setShowShareModal(!showShareModal);

  const convertToSqFt = (length, width, unit) => {
    if (unit === 'mm') return (length / 304.8) * (width / 304.8);
    if (unit === 'cm') return (length / 30.48) * (width / 30.48);
    if (unit === 'in') return (length / 12) * (width / 12);
    return length * width;
  };

  const floorAreaSqFt = convertToSqFt(areaLength, areaWidth, areaUnit);
  const tileAreaSqFt = convertToSqFt(tileLength, tileWidth, tileUnit);
  const baseTilesNeeded = Math.ceil(floorAreaSqFt / tileAreaSqFt);
  const totalTiles = Math.ceil(baseTilesNeeded * 1.1); // 10% buffer
  const boxesNeeded = Math.ceil(totalTiles / (tilesPerBox || 1));
  const estimatedCost =
    priceUnit === 'tile' ? totalTiles * tilePrice : boxesNeeded * tilePrice;

  const handleCalculate = () => setShowResult(true);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-white pt-6">
      <Header />
      <div className="flex-grow border border-gray-300/50 rounded-md bg-gray-100/20 drop-shadow-xs mt-20 p-8 m-10">
        {/* Form */}
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Find out exactly how many tiles you need
          </h2>

          {/* Tile Type */}
          <div className="mb-6">
            <p className="font-medium mb-2">What is the type of tile?</p>
            <label className="mr-4">
              <input
                type="radio"
                name="tileType"
                checked={type === 'floor'}
                onChange={() => setType('floor')}
                className="mr-1"
              />{' '}
              Floor Tile
            </label>
            <label>
              <input
                type="radio"
                name="tileType"
                checked={type === 'wall'}
                onChange={() => setType('wall')}
                className="mr-1"
              />{' '}
              Wall Tile
            </label>
          </div>

          {/* Tile Size Option */}
          <div className="mb-6">
            <p className="font-medium mb-2">What is the size of your tile?</p>
            <label className="mr-4">
              <input
                type="radio"
                name="sizeOption"
                checked={!useCustom}
                onChange={() => setUseCustom(false)}
                className="mr-1"
              />{' '}
              Standard size
            </label>
            <label>
              <input
                type="radio"
                name="sizeOption"
                checked={useCustom}
                onChange={() => setUseCustom(true)}
                className="mr-1"
              />{' '}
              Use custom size
            </label>

            <div className="mt-2 flex flex-wrap gap-4">
              {!useCustom ? (
                <>
                  <select
                    className="border p-2 rounded w-44"
                    value={`${tileWidth}x${tileLength}`}
                    onChange={(e) => {
                      const [w, h] = e.target.value.split('x');
                      setTileLength(Number(h));
                      setTileWidth(Number(w));
                    }}
                  >
                    <option value="600x600">600 x 600</option>
                    <option value="300x300">300 x 300</option>
                    <option value="800x800">800 x 800</option>
                  </select>
                  <select
                    className="border p-2 rounded"
                    value={tileUnit}
                    onChange={(e) => setTileUnit(e.target.value)}
                  >
                    <option value="mm">Millimetres</option>
                    <option value="cm">Centimetres</option>
                    <option value="in">Inches</option>
                  </select>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    className="border p-2 rounded w-24"
                    placeholder="Length"
                    value={tileLength}
                    onChange={(e) => setTileLength(Number(e.target.value))}
                  />
                  <input
                    type="number"
                    className="border p-2 rounded w-24"
                    placeholder="Width"
                    value={tileWidth}
                    onChange={(e) => setTileWidth(Number(e.target.value))}
                  />
                  <select
                    className="border p-2 rounded"
                    value={tileUnit}
                    onChange={(e) => setTileUnit(e.target.value)}
                  >
                    <option value="mm">Millimetres</option>
                    <option value="cm">Centimetres</option>
                    <option value="in">Inches</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Box Size & Price */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Tiles per Box (Optional)</label>
              <input
                type="number"
                value={tilesPerBox}
                onChange={(e) => setTilesPerBox(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Price (Optional)</label>
              <input
                type="number"
                value={tilePrice}
                onChange={(e) => setTilePrice(Number(e.target.value))}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Price Unit</label>
              <select
                className="w-full border p-2 rounded"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
              >
                <option value="tile">Per Tile</option>
                <option value="box">Per Box</option>
              </select>
            </div>
          </div>

          {/* Area */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              What’s the total area you’re planning to tile?
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={areaLength}
                onChange={(e) => setAreaLength(Number(e.target.value))}
                className="border p-2 rounded w-24"
              />
              <input
                type="number"
                value={areaWidth}
                onChange={(e) => setAreaWidth(Number(e.target.value))}
                className="border p-2 rounded w-24"
              />
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="in">Inches</option>
                <option value="ft">Feet</option>
                <option value="m">Metres</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleCalculate}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-6 py-2 rounded-md shadow"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* Result Box */}
        {showResult && (
          <div className="bg-yellow-100 mt-10 max-w-5xl mx-auto p-6 rounded-md border border-yellow-300 mb-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-yellow-700" /> Your Tiling Project Estimation
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Your Floor Tile Size:</strong> {tileWidth} x {tileLength} {tileUnit}</p>
                <p><strong>Total Area:</strong> {floorAreaSqFt.toFixed(2)} Sq Ft</p>
                <p><strong>Total Tiles Needed:</strong> {totalTiles}</p>
                <p><strong>Boxes Needed:</strong> {boxesNeeded} box(es) ({tilesPerBox} tiles/box)</p>
              </div>
              <div>
                <p><strong>Estimated Total Cost:</strong> ₹{estimatedCost.toLocaleString()}</p>
                <p className="text-sm text-gray-700 mt-2">
                  This includes an extra 10% for breakage, cutting, or wastage.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4 print:hidden">
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TileCalculator;
