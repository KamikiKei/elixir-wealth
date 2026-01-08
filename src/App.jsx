import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Layout from "@/Layout";
import Dashboard from "@/pages/Dashboard.jsx";
import AddTransaction from "@/pages/AddTransaction.jsx";
import LuminousChat from "@/pages/LuminousChat.jsx"; 
import Auth from "@/pages/Auth.jsx";

// ★ ここから下を忘れずに追加してください！
import Projects from "@/pages/Projects.jsx"; 
import ProjectDetail from "@/pages/ProjectDetail.jsx";
import AIAdvisor from "@/pages/AIAdvisor.jsx"; // もし AIAdvisor.jsx という名前ならこれ

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
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/detail" element={<ProjectDetail />} />
          <Route path="/advisor" element={<AIAdvisor />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;