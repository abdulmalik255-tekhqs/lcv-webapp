import { useState } from "react";
import { Button, Card, InputField } from "./index";
import LoginFooterComponent from "@/pages/layout/LoginFooter";
import { Logo } from "@/assets";

const STATIC_PASSWORD = "LCVinternal@123";
const PASSWORD_VERIFIED_KEY = "app_password_verified";

export const isPasswordVerified = () => {
  return localStorage.getItem(PASSWORD_VERIFIED_KEY) === "true";
};

export const setPasswordVerified = () => {
  localStorage.setItem(PASSWORD_VERIFIED_KEY, "true");
};

const PasswordProtection = ({ onVerified }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (password === STATIC_PASSWORD) {
        setPasswordVerified();
        onVerified();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5fa] !w-full !p-0">
      <header className="relative h-40 sm:h-48 md:h-60 w-full bg-gradient-to-b from-black via-[#16003a] to-[#5c00c7]">
        <div className="flex mt-8 sm:mt-12 items-center justify-center">
          <Logo className="!h-12 w-auto text-white sm:h-8" />
        </div>
      </header>

      <section className="relative z-10 flex flex-1 justify-center px-4 sm:px-6">
        <div className="-mt-16 sm:-mt-20 md:-mt-24 w-full max-w-4xl py-4">
          <Card className="w-full rounded-[20px] border-none bg-white px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[200px] py-6 sm:py-[24px] !h-[410px] !max-h-[430px] !overflow-y-auto !scrollbar-hide">
            <div className="mb-4 sm:mb-6 py-4 sm:py-6 md:py-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold font-[atacama] ">
                Access Required
              </h2>
              <p 
                className="mt-2 text-sm sm:text-[15px] font-normal  transition-colors"
                onClick={() => setPassword(STATIC_PASSWORD)}
              >
                Please enter the password to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                error={error}
                disabled={isLoading}
                autoFocus
              />

              <Button
        type="submit"
        variant="gradient"
        disabled={isLoading}
        loading={isLoading}
        className="h-14 sm:h-12 text-sm sm:text-base font-semibold w-full mt-6"
   
      >
        
          Continue
        
      </Button>
            </form>
          </Card>
        </div>
      </section>
      <LoginFooterComponent />
    </div>
  );
};

export default PasswordProtection;
