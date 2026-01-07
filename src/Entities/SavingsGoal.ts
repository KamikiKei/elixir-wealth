import { supabase } from "../lib/supabaseClient.jsx";

export const SavingsGoal = {
  list: async (order?: string) => {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  }
};