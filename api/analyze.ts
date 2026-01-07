// api/analyze.ts (画像対応 ＋ エラーハンドリング完全版)
export default async function handler(req, res) {
  const { prompt, systemPrompt, image } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // コンテンツの組み立て
  const contents = [
    {
      parts: [
        { text: prompt + "\n\n必ず有効なJSON形式で回答してください。" },
        // 画像がある場合のみ inline_data を追加
        ...(image ? [{ inline_data: { mime_type: "image/jpeg", data: image } }] : [])
      ]
    }
  ];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { 
          parts: [{ text: systemPrompt || "あなたは冷徹なAIルミナスです。" }] 
        },
        contents,
        generationConfig: { 
          response_mime_type: "application/json" 
        }
      }),
    });

    const data = await response.json();

    // --- ここで中身が空でないか厳重にチェック ---
    if (data.candidates && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0].text) {
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      res.status(200).json(aiResponse);
      
    } else {
      // APIは成功したけど、中身が空（ブロックされた等）の場合
      console.error("Gemini Response Empty or Blocked:", JSON.stringify(data));
      res.status(500).json({ error: "Geminiの回答が空です。画像が鮮明か確認してください。" });
    }

  } catch (error) {
    // 通信エラーやサーバーエラーの場合
    console.error("Server Error:", error);
    res.status(500).json({ error: "サーバー側でエラーが発生しました。" });
  }
}