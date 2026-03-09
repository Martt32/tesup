import Router from "./router/Router";
import Loader from "./components/Loader";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { LoadingContext } from "./context/Context";
import { AuthProvider } from "./context/AuthContext.jsx";
export default function Home() {
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2500);
  // });
  return (
    <LoadingContext value={{ loading, setLoading }}>
      <AuthProvider>
        <div>
          <Toaster position="top-right" richColors />
          {/* className="bg-gradient-to-br from-[#0c0f2b] via-[#1a1235] to-[#0b1b2b] text-white min-h-screen overflow-hidden" */}

          {loading && <Loader />}
          <Router />
        </div>
      </AuthProvider>
    </LoadingContext>
  );
}
