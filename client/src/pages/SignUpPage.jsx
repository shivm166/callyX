import { useState } from "react";
import { Headset } from "lucide-react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signUpMutation } = useSignup();

  const handleChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation(signUpData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8   ">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto bg-base-100/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-primary/30">
        {/* LEFT SIDE - SIGNUP FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* LOGO */}
          <div className="mb-6 flex items-center gap-2">
            <Headset className="size-9 text-primary drop-shadow-md" />
            <span className="text-3xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Callyx
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold text-base-content">
              Create an Account
            </h2>
            <p className="text-sm opacity-70">
              Join <span className="font-medium text-primary">Callyx</span> and
              start your calling adventures.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="ex shivam gauswami"
                name="fullName"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full rounded-lg"
                value={signUpData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mt-2">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  required
                />
                <span className="text-xs leading-tight">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">
                    terms of service
                  </span>
                  {""}
                  and{" "}
                  <span className="text-primary hover:underline">
                    privacy policy
                  </span>
                </span>
              </label>
            </div>

            <button className="btn btn-primary w-full" type="submit">
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account ?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - ILLUSTRATION */}
        <div className="hidden  lg:flex w-full  lg:w-1/2 bg-primary/10  items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0  backdrop-blur-sm"></div>
          <div className="relative aspect-square max-w-sm mx-auto">
            <img
              src="/signup.png"
              alt="Connect illustration"
              className="w-full h-full"
            />
            <h2 className="text-2xl font-bold mb-2">Welcome to Callyx</h2>
            <p className="opacity-90 text-sm leading-relaxed">
              Experience real-time WebRTC calling, crystal-clear audio, and
              instant peer-to-peer connections — all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
