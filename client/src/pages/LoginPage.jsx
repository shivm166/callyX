import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { login } from "../lib/api";
import useAuthUser from "../hooks/useAuthUSer";
import toast from "react-hot-toast";

const LoginPage = () => {
  // const { authUser } = useAuthUser();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: () => {
      toast.success("login succesfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    mutate(loginData);
  };
  return (
    <>
      <div>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
