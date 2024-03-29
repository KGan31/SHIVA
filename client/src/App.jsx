import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import SignUp from './pages/SignupPage';
import Pricing from './pages/PricingPage';
import Footer from './components/Footer/Footer';
import GlobalStyle from './globalStyles';;
import Codegen from "./pages/CodegenPage";

const App = () => {
  return (
    <main className="bg-slate-300/20">
      <Router>
        <GlobalStyle />
			<Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/codegen" element={<Codegen />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
