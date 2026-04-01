import { useState } from "react";

export default function CopyButton({ text, label = "복사", className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 시 폴백
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded text-xs font-medium transition-all
                  ${
                    copied
                      ? "bg-green-700 text-white"
                      : "bg-ff-blue text-white hover:bg-ff-blue/80"
                  } ${className}`}
    >
      {copied ? "✅ 복사됨" : `📋 ${label}`}
    </button>
  );
}
