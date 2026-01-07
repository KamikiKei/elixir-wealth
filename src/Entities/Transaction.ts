import { supabase } from "../lib/supabaseClient.jsx";

export interface TransactionType {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  wealth_classification?: string;
  ai_evaluation?: string;
}

export const Transaction = {
  // ダッシュボード等で使用する取得メソッド
  list: async (order: string, limit: number) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Fetch Error:", error);
      return [];
    }
    return data;
  },

  // addTransactionで使用する作成メソッド
  create: async (payload: TransactionType) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([payload])
      .select();

    if (error) throw error;
    return data[0];
  }
};