import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api";
import { toast } from "react-toastify";

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Validation schema
  const schema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const formData = {
      email: (form.email as HTMLInputElement).value,
      password: (form.password as HTMLInputElement).value,
    };

    try {
      await schema.validate(formData, { abortEarly: false });
     
          const response = await apiFetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(formData),
      });
      console.log("response-",response)
      const { success } = response;

      if (!success ) {
        throw new Error("Login failed");
      }
      console.log("Authhhhhhh",response.token)
      localStorage.setItem("auth_token",response.token);
      console.log("Authhhhhhh",localStorage.getItem("auth_token"))
      navigate("/");

    } catch (err: any) {
      if (err.name === "ValidationError") {
        toast(err.message);
      }
      // 🔴 API errors
      else if (err.response) {
        toast(err.response.data.message || "Login failed");
      }
      // 🔴 Unknown errors
      else {
        toast("Login Failed");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center h-screen bg-gray-900">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
     
          <h2 className="mt-10 text-center text-2xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Email address
              </label>
              <input
                name="email"
                type="email"
                className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-white border border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-white border border-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-500 py-2 font-semibold disabled:opacity-60 "
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            
          </form>
          <div className="text-center text-sm text-gray-400">
  Don’t have an account?{" "}
  <button
    type="button"
    onClick={() => navigate("/signup")}
    className="font-semibold text-indigo-400 hover:text-indigo-300"
  >
    Sign up
  </button>
</div>

        </div>
      </div>
    </div>
  );
}

export default SignIn;
