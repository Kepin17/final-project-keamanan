import { IoLogIn } from "react-icons/io5";
import Button from "../../elements/Button";
import Logo from "../../elements/Logo";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = ({ title, onSubmit, children, selfRegist, isLoading = false }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <div className="wrapper min-h-screen bg-slate-700 relative flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="auth-wrapper w-full max-w-md relative z-10">
        <form className="form-wrapper flex flex-col gap-6 w-full bg-white backdrop-blur-sm min-h-[24rem] p-8 rounded-2xl shadow-2xl border border-white/20 animate-scale-in" onSubmit={handleSubmit}>
          <div className="form-header flex flex-col gap-4 text-center">
            <div className="flex flex-col items-center gap-3">
              <Logo size="lg" />
              <h1 className="font-bold text-responsive-2xl text-slate-800">{title === "login" ? "Welcome Back" : title === "register" ? "Create Account" : "Verification"}</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </div>
            <p className="text-slate-600 text-responsive-sm">{title === "login" ? "Please sign in to your account 👋" : title === "register" ? "Create your new account 🚀" : "Enter verification code to continue �"}</p>
          </div>

          <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {children}
          </div>

          {selfRegist ? (
            title === "login" ? (
              <div className="form-footer flex flex-col gap-3 mt-2 text-center">
                <Link to="/forgot-pass" className="text-blue-600 text-responsive-sm hover:text-blue-800 hover:underline transition-colors">
                  Forgot password?
                </Link>
                <Link to="/register" className="text-blue-600 text-responsive-sm hover:text-blue-800 hover:underline transition-colors">
                  Don't have an account? Register
                </Link>
              </div>
            ) : title === "register" ? (
              <div className="form-footer flex justify-center mt-2">
                <Link to="/login" className="text-blue-600 text-responsive-sm hover:text-blue-800 hover:underline transition-colors">
                  Already have an account? Login
                </Link>
              </div>
            ) : (
              ""
            )
          ) : (
            <div className="form-footer flex flex-col gap-3 mt-2 text-center">
              {title === "login" ? (
                <Link to="/forgot-pass" className="text-blue-600 text-responsive-sm hover:text-blue-800 hover:underline transition-colors">
                  Forgot Password?
                </Link>
              ) : title === "otp" ? (
                <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800">
                  Send OTP Code Again
                </Button>
              ) : (
                ""
              )}
            </div>
          )}

          <Button disabled={isLoading} loading={isLoading} variant="primary" size="lg" isFull className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <IoLogIn className="text-xl" />
            <span className="font-semibold">{title === "login" ? "Sign In" : title === "register" ? "Create Account" : "Verify Code"}</span>
          </Button>
        </form>
      </div>

      {/* Enhanced Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-4"
        toastClassName="card-base shadow-lg rounded-xl"
        bodyClassName="text-responsive-sm"
        progressClassName="bg-gradient-to-r from-blue-500 to-blue-600"
      />
    </div>
  );
};

export default AuthLayout;
