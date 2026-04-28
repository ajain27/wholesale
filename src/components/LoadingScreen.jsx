import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

export default function LoadingScreen({
  isLoading,
  minDuration = 1000,
  loadingContent,
  children,
}) {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [loadingStart, setLoadingStart] = useState(null);

  useEffect(() => {
    let timer;

    if (isLoading) {
      setShowLoading(true);
      setLoadingStart(Date.now());
      return () => clearTimeout(timer);
    }

    if (loadingStart !== null) {
      const elapsed = Date.now() - loadingStart;
      const remaining = Math.max(0, minDuration - elapsed);
      timer = setTimeout(() => {
        setShowLoading(false);
      }, remaining);
      return () => clearTimeout(timer);
    }

    setShowLoading(false);
    return undefined;
  }, [isLoading, minDuration, loadingStart]);

  if (showLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <Loader className="loading-spinner" size={24} />
          {loadingContent || <span>Loading data...</span>}
        </div>
      </div>
    );
  }

  return children;
}
