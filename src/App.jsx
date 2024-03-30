import Main from "./components/main/Main";
import Sidebar from "./components/sidebar/Sidebar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Shiva from "./components/Shiva";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" exact element={<Shiva />} />
      </Routes>
    </Router>
  );
};

export default App;
