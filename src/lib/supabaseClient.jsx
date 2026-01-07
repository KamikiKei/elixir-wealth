import { createClient } from '@supabase/supabase-js'

// .env.local に書いた設定を読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 設定が漏れている場合にエラーを出す（デバッグ用）
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("エラー: Supabaseの環境変数が設定されていません。.env.localを確認してください。")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)