import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { apiFetch } from "../api";
import { toast } from "react-toastify";


function EmailVerification() {
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    otp: Yup.string().required(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;

  const formData = {
    email: (form.email as HTMLInputElement).value,
    otp: (form.otp as HTMLInputElement).value,
  };

  try {
    // ✅ 1. Validate input
    await schema.validate(formData, { abortEarly: false });

    // ✅ 2. Call API
    const response = await apiFetch("/api/auth/verifycode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        otpCode: formData.otp,
      }),
    });

    if (!response.success) {
      toast("Verification failed");
      return;
    }

    navigate("/");

  } catch (err: any) {
    if (err.name === "ValidationError") {
      toast(err.message);
    } else {
      toast(err.message || "Something went wrong");
    }
  }
};

  return (
    <div className="flex flex-row  justify-center items-center h-screen bg-gray-900">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white ">
            Verify OTP
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-500"
              >
                Enter Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="text"
                  name="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 text-white"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-500"
              >
                Enter OTP
              </label>
              <div className="mt-2">
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  required
                  autoComplete="otp"
                  className="block w-full rounded-md bg-black/5 px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold  hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
