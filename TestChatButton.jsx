"use client";

import { useState } from "react";

export default function TestChatButton() {
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello from frontend!" }]
      })
    });

    const data = await res.json();
    setResponse(data.content || "No response from API");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Ask Chat API
      </button>
      <div style={{ marginTop: "20px" }}>
        <strong>Response:</strong> {response}
      </div>
    </div>
  );
}
