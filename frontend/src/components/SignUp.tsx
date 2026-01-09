import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { apiFetch } from "../api";
import { toast } from "react-toastify";
function SignUp() {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;

  const formData = {
    name: (form.name as unknown as HTMLInputElement).value,
    email: (form.email as HTMLInputElement).value,
    password: (form.password as HTMLInputElement).value,
  };

  try {
    await schema.validate(formData, { abortEarly: false });
    const response = await apiFetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.success) {
      toast("Register failed");
      return;
    }
    toast("Registration successful! Please verify your email.");
    navigate("/verifyotpcode");
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const messages = err.inner.map((e: any) => e.message);
      toast(messages.join("\n"));
    } else {
      toast(err.message || "Something went wrong");
    }
  }
};

  const navigate = useNavigate();
  return (
    <div className="flex flex-row  justify-center items-center h-screen bg-gray-900">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-500"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 text-white"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-500"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-500 "
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold  hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
