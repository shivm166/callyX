// client/src/pages/LandingPage.jsx
import { Link } from "react-router-dom";
import { MessageSquare, Video, Shield } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="hero min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to CallyX
          </h1>
          <p className="py-6 text-lg">
            Connect with friends and family like never before. Experience crystal-clear video calls and secure messaging in one seamless platform.
          </p>
          
          <div className="flex justify-center gap-4 mb-12">
            <Link to="/signup" className="btn btn-primary px-8">Get Started</Link>
            <Link to="/login" className="btn btn-outline px-8">Login</Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-base-100 rounded-full text-primary">
                <Video size={24} />
              </div>
              <span className="text-sm font-medium">HD Video</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-base-100 rounded-full text-primary">
                <MessageSquare size={24} />
              </div>
              <span className="text-sm font-medium">Real-time Chat</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-base-100 rounded-full text-primary">
                <Shield size={24} />
              </div>
              <span className="text-sm font-medium">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;