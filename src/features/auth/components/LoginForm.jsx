import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setUser } from "../authSlice";
import { showToast } from "../../../store/toastSlice";
import { loginApi } from "../services/authApi";
import { InputField } from "../../../components/ui/InputField";
import { Button } from "../../../components/ui/Button";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const isEmail = data.identifier.includes("@");
      const requestBody = {
        email: isEmail ? data.identifier : undefined,
        username: !isEmail ? data.identifier : undefined,
        password: data.password,
      };

      const response = await loginApi(requestBody);
      const user = response?.data?.user;

      dispatch(setUser(user));
      dispatch(showToast("Successfully authenticated session", "success"));

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Invalid authentication credentials";
      dispatch(showToast(errorMsg, "error"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Welcome Back</h1>
        <p className="text-xs text-slate-400">Sign in to access your enterprise video portal</p>
      </div>

      <InputField
        label="Username or Email"
        type="text"
        placeholder="Enter username or email address"
        error={errors.identifier?.message}
        disabled={isSubmitting}
        {...register("identifier")}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isSubmitting}
        {...register("password")}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        Sign In to Portal
      </Button>

      <div className="text-center text-xs text-slate-400 mt-2">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-cyan hover:underline font-medium">
          Create Portal Account
        </Link>
      </div>
    </form>
  );
};
export default LoginForm;
