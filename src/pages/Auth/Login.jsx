import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLogin } from "../../api";
import { ROLE_DEFAULT_ROUTES } from "../../constants";
import { Button, Card, InputField } from "../../components/shared";
import { Logo, FieldCross } from "../../assets";
import { isValidEmail } from "../../utils";
import LoginFooterComponent from "../layout/LoginFooter";
import useToast from "@/hooks/useCustomToast";

const Login = () => {
  const { isAuthenticated, role } = useAuth();
  const { showBottomRightToast: success, showErrorToast: showError } =
    useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();


  

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      const destination =
        location.state?.from?.pathname ??
        ROLE_DEFAULT_ROUTES[role] ??
        "/dashboard";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  

  const [form, setForm] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = loginMutation.isPending;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setFormErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid corporate email address.";
    }

    if (!form.password || form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate() || isLoading) return;

    try {
      const response = await loginMutation.mutateAsync({
        email: form.email,
        password: form.password,
      });

      const role = response?.role || response?.user?.role;
      const userName =
        response?.user?.first_name || response?.user?.name || "User";
      const destination =
        location.state?.from?.pathname ??
        ROLE_DEFAULT_ROUTES[role] ??
        "/dashboard";

      // success(`Welcome back, ${userName}!`);
      navigate(destination, { replace: true });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to sign in right now. Please check your credentials.";
      showError(errorMessage);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f5fa] !w-full !p-0">
      <header className="relative h-40 sm:h-48 md:h-52 w-full bg-gradient-to-b from-black via-[#16003a] to-[#5c00c7]">
        <div className="flex mt-8 sm:mt-12 items-center justify-center">
          <Logo className="!h-12 w-auto text-white sm:h-8" />
        </div>
      </header>

      <section className="relative z-10 flex flex-1 justify-center px-4 sm:px-6">
        <div className="-mt-16 sm:-mt-20 md:-mt-24 w-full max-w-4xl py-4">
          <Card className="w-full !rounded-[20px] border-none bg-white px-4 sm:px-8 md:px-16 lg:px-24 xl:px-[200px] py-6 sm:py-[24px]">
            <div className="pt-4 sm:pt-6 md:pt-12 text-center">
              <h2 className="text-[32px] font-normal font-[atacama] ">
                Login
              </h2>
              <p className="mt-2 text-sm sm:text-[15px] font-normal pb-[48px]">
                Enter your admin credentials to access the system.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <InputField
                label="Email address"
                hideLabel
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={handleChange}
                error={formErrors.email}
                clearButton={form.email ? <FieldCross /> : null}
                onClear={() => {
                  setForm((previous) => ({ ...previous, email: "" }));
                  setFormErrors((previous) => ({
                    ...previous,
                    email: undefined,
                  }));
                }}
              />

              <InputField
                label="Password"
                hideLabel
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                required
                value={form.password}
                onChange={handleChange}
                error={formErrors.password}
                clearButton={form.password ? <FieldCross /> : null}
                onClear={() => {
                  setForm((previous) => ({ ...previous, password: "" }));
                  setFormErrors((previous) => ({
                    ...previous,
                    password: undefined,
                  }));
                }}
              />

              <div className="flex flex-col gap-3 text-xs sm:text-sm md:flex-row md:items-center md:justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 !text-[#1C1C1E] text-[13px] font-normal"
                  />
                  <span className="whitespace-nowrap">
                    Keep me logged in for 30 days
                  </span>
                </label>
                <Link
                  className="font-medium text-[#131DBB] whitespace-nowrap"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                variant="gradient"
                className="h-11 sm:h-12 text-sm sm:text-base font-semibold"
              >
                
                  Continue
                
              </Button>

              <div className="text-xs sm:text-[13px] text-[#1C1C1E] text-center pb-[30px]">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#131DBB] pl-1 font-medium">
                  Sign Up
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </section>

      <LoginFooterComponent />
    </main>
  );
};

export default Login;
