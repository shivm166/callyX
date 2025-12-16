import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      data-theme={theme}
    >
      <div className="relative w-32 h-32">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-2 border-cyan-400 opacity-50 animate-pulse" />
        
        {/* Inner rotating ring (opposite direction) */}
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-pink-500 border-l-blue-500 animate-spin" style={{ animationDirection: 'reverse' }} />
        
        {/* Center phone icon with glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-50 rounded-lg animate-pulse" />
            <svg className="w-12 h-12 text-cyan-300 relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a1 1 0 00-1-1H8a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0">
          {[0, 120, 240].map((angle) => (
            <div
              key={angle}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                animation: `orbit 3s linear infinite`,
                transformOrigin: `calc(-48px) 0`,
                transform: `rotate(${angle}deg)`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-20 text-center">
        <p className="text-cyan-300 font-semibold tracking-widest">
          <span className="inline-block">C</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>o</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>n</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>n</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>e</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>c</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>t</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>i</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>n</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.8s' }}>g</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0.9s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '1s' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '1.1s' }}>.</span>
        </p>
      </div>

      <style>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(48px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(48px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;