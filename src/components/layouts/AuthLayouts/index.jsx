import { IoLogIn } from "react-icons/io5";
import Button from "../../elements/Button";
import { Link } from "react-router-dom";

const AuthLayout = ({ title, onSubmit, children }) => {
  return (
    <div className="wrapper w-full h-screen bg-slate-200 relative">
      <div className="auth-wrapper fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
        <form className="form-wrapper flex flex-col gap-6 w-full bg-white min-h-[24rem] p-8 rounded-lg shadow-lg" onSubmit={onSubmit}>
          <div className="form-header flex flex-col gap-1.5">
            <h1 className="font-bold text-2xl">MedInsight {title === "login" ? "Login" : "Register"} Page</h1>
            <p className="text-slate-500 text-sm">please introduction yourself 👋</p>
          </div>

          <div className="flex flex-col gap-4">{children}</div>

          {title === "login" ? (
            <div className="form-footer flex flex-col gap-2 mt-2">
              <Link to={"/forgot-pass"} className="text-blue-600 text-sm hover:underline">
                Forgot password?
              </Link>

              <Link to={"/register"} className="text-blue-600 text-sm hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          ) : (
            <div className="form-footer flex justify-end mt-2">
              <Link to={"/login"} className="text-blue-600 text-sm hover:underline">
                Already have an account? Login
              </Link>
            </div>
          )}

          <Button>
            <div className="flex items-center justify-center gap-2 w-full">
              <IoLogIn className="text-xl text-white" />
              <span className="text-white font-semibold">{title === "login" ? "Login" : "Register"}</span>
            </div>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthLayout;
