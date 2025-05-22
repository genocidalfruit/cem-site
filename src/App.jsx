import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import CostCalc from './CostCalc.jsx'
import FrontPage from './FrontPage.jsx'
import StoreLocator from './StoreLocator.jsx'
import EMICalculator from './EmiCalculator.jsx'
import TileCalculator from './TileCalculator.jsx'
import ProductPredictor from './ProductPredictor.jsx'
import InfoVideos from './InfoVideos.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/cost-calculator" element={<CostCalc />} />
        <Route path="/store-locator" element={<StoreLocator />} />
        <Route path="/emi-calculator" element={<EMICalculator />} />
        <Route path="/tile-calculator" element={<TileCalculator />} />
        <Route path="/product-predictor" element={<ProductPredictor />} />
        <Route path="/videos" element={<InfoVideos />} />
      </Routes>
    </Router>
  )
}

export default App