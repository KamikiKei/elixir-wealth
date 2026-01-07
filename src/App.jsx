import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/Layout";
import Dashboard from "@/pages/Dashboard.jsx";
import addTransaction from "@/pages/addTransaction";
import luminousChat from "@/pages/luminousChat"; 

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<addTransaction />} />
          <Route path="/chat" element={<luminousChat />} />
          <Route path="/advisor" element={<luminousChat />} /> 
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;