import { Suspense, useState, useEffect } from "react";
import { ToastProvider } from "./components/shared/ToastContainer";
import AppRoutes from "./routes/AppRoutes.jsx";
import ScrollToTop from "./components/shared/ScrollToTop.jsx";
import PasswordProtection, { isPasswordVerified } from "./components/shared/PasswordProtection.jsx";

const App = () => {
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if password was already verified
    if (isPasswordVerified()) {
      setIsVerified(true);
    }
    setIsPasswordChecked(true);
  }, []);

  const handlePasswordVerified = () => {
    setIsVerified(true);
  };

  // Show loading state while checking password
  if (!isPasswordChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7]">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  // Show password protection screen if not verified
  if (!isVerified) {
    return <PasswordProtection onVerified={handlePasswordVerified} />;
  }

  // Show main app after password verification
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F2F2F7] !p-0 ">
        <ScrollToTop />
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7]">
              <span className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </div>
    </ToastProvider>
  );
};

export default App;
