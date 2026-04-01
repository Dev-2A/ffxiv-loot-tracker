import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = useCallback(
    {
      info: (msg) => addToast(msg, "info"),
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      warn: (msg) => addToast(msg, "warn"),
    },
    [addToast],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* 토스트 컨테이너 */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-in px-4 py-3 rounded-lg shadow-lg text-sm font-medium
                        border backdrop-blur-sm ${
                          t.type === "success"
                            ? "bg-green-900/80 border-green-500/50 text-green-200"
                            : t.type === "error"
                              ? "bg-red-900/80 border-red-500/50 text-red-200"
                              : t.type === "warn"
                                ? "bg-yellow-900/80 border-yellow-500/50 text-yellow-200"
                                : "bg-ff-surface/90 border-ff-blue/50 text-ff-text"
                        }`}
          >
            <span className="mr-2">
              {t.type === "success"
                ? "✅"
                : t.type === "error"
                  ? "❌"
                  : t.type === "warn"
                    ? "⚠️"
                    : "ℹ️"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 안에서 사용해야 합니다.");
  }
  return context;
}
