import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient"; // 追加
import Layout from "@/Layout";
import Dashboard from "@/pages/Dashboard.jsx";
import AddTransaction from "@/pages/AddTransaction";
import LuminousChat from "@/pages/LuminousChat"; 
import Auth from "@/pages/Auth.jsx"; // 追加

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 現在のセッション（ログイン状態）を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ログイン状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // まだログインしていない場合は、何をしてもAuth画面を表示
  if (!session) {
    return (
      <Router>
        <Layout>
          <Auth />
        </Layout>
      </Router>
    );
  }

  // ログインしている場合は、今までのルーティングを表示
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/chat" element={<LuminousChat />} />
          <Route path="/advisor" element={<LuminousChat />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;