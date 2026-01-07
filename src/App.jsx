import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/Layout";
import Dashboard from "@/pages/Dashboard.jsx";
import AddTransaction from "@/pages/AddTransaction";
import LuminousChat from "@/pages/LuminousChat"; 

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/chat" element={<LuminousChat />} />
          <Route path="/advisor" element={<LuminousChat />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;