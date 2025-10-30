import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200 shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-full animate-bounce-slow">
          <UsersIcon className="w-10 h-10 text-primary" />
        </div>

        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          No Friends Yet
        </h3>
      </div>
    </div>
  );
};

export default NoFriendsFound;
