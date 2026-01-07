// src/lib/aiService.ts
export const askLuminous = async (prompt: string, systemPrompt?: string) => {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemPrompt }),
  });
  
  const result = await response.json();
  return JSON.parse(result); // JSON文字列をオブジェクトに変換
};