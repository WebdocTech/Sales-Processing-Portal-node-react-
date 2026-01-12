import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import toast from "react-hot-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // navigate("/dashboard");
    try {
      const payload = {
        email,
        password,
      };

      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Login Response:", data);
      if (data?.success === true) {
        sessionStorage.setItem("user", JSON.stringify(data.data));
        navigate("/dashboard");
      } else {
        setErrorMessage(data?.message || "Invalid credentials");
        toast.error(data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Network or server error.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.png" className="h-20" alt="Logo" />
        </div>

        <h2 className="text-3xl font-bold text-center text-teal-100 mb-8">
          Login
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-gray-800 mb-1 font-semibold">
              Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="email"
                className="w-full pl-10 p-3 rounded-lg outline outline-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-100"
                value={email}
                placeholder="test@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-800 mb-1 font-semibold">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type={showPass ? "text" : "password"}
                className="w-full pl-10 pr-10 p-3 rounded-lg outline outline-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-100"
                value={password}
                placeholder="*********"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-50 cursor-pointer hover:bg-teal-100 transition text-black font-semibold py-3 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
//  "email": "test@example.com",
//   "password": "123456"
