import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setFormError("Email address is required");
      return;
    } else {
      setFormError("");
    }

    const result = await signIn("email", {
      email,
      callbackUrl: "/dashboard",
      redirect: false,
    });
    console.log("Url:", result.url);
    if (!result.error) {
      router.push(result.url);
    } else {
      let error = "E-mail is not registered!";
      setErrorMessage(error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md border border-black">
        <h2 className="text-2xl font-semibold text-center mb-6">Login To</h2>
        <img src="/img/logo_bia.png" alt="BIA Logo" />

        <form onSubmit={handleLogin}>
          <div className={`mb-4 ${formError ? "border-red-500" : ""}`}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`mt-1 p-3 rounded-md w-full border focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                ${formError ? "border-red-500" : ""}`}
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formError && (
              <div className="text-red-600">
                <p>You have to enter an email</p>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="alert alert-error" style={{ marginBottom: "20px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="text-center">
            <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Send Link
            </button>
            <div className="block text-sm font-small text-gray-500">
              Not a BIA member? Contact BIA Benefits to Login
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
