import { supabase } from "../lib/supabaseClient.jsx";

export const GoalService = {
  async create(goalData: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("ログインが必要です。");
    
    // 送信データを整理
    // 400エラーの原因になりやすい「status」を除外しました
    const insertData = {
      user_id: user.id,
      title: goalData.title,
      target_amount: Number(goalData.target_amount),
      current_amount: Number(goalData.current_amount) || 0,
      target_date: goalData.target_date // ← Supabaseに今作った名前と一致！
    };  
    console.log("🚀 Supabaseへ送信直前のデータ:", insertData);

    const { data, error } = await supabase
      .from('savings_goals')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // ↓ ここでエラーの「真の理由」が表示されます
      console.error("❌ Supabaseエラーの正体:", error.message);
      console.error("💡 ヒント:", error.hint);
      throw error;
    }
    return data;
  },

  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};