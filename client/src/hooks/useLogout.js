import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();
  
  const { mutate, error, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      console.error("Logout failed:", err);
    }
  });

  return { isPending, error, logoutMutation: mutate };
};

export default useLogout;