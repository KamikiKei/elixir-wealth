import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Pages/Dashboard";
import AddTransaction from "./Pages/AddTransaction";
import LuminousChat from "./Pages/LuminousChat"; // これがあるなら追加！

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/chat" element={<LuminousChat />} />
          {/* AIAdvisor.jsがまだなら、一旦LuminousChatを表示させるのもアリです */}
          <Route path="/advisor" element={<LuminousChat />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;