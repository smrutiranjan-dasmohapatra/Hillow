import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LoginDrawer({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-semibold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <button
            onClick={onClose}
            className="text-3xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          {isLogin ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <RegisterForm
              onSuccess={() => setIsLogin(true)}
            />
          )}

        </div>

        {/* Footer */}
        <div className="border-t p-6 text-center">

          {isLogin ? (
            <>
              Don't have an account?

              <button
                onClick={() => setIsLogin(false)}
                className="ml-2 font-semibold underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?

              <button
                onClick={() => setIsLogin(true)}
                className="ml-2 font-semibold underline"
              >
                Login
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}