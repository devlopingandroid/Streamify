import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const isEmail = data.identifier.includes("@");
    const requestBody = {
      password: data.password,
    };
    if (isEmail) {
      requestBody.email = data.identifier;
    } else {
      requestBody.username = data.identifier;
    }

    loginMutation.mutate(requestBody, {
      onSuccess: () => {
        toast.success("Welcome back to Streamify!");
        navigate("/");
      },
      onError: (err) => {
        toast.error(err?.message || "Invalid credentials provided.");
      },
    });
  };

  const isPending = loginMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full text-left">
      <InputField
        label="Username or Email"
        type="text"
        placeholder="Enter username or email address"
        error={errors.identifier?.message}
        disabled={isPending}
        {...register("identifier")}
        aria-label="Username or Email address input"
      />

      <div className="relative w-full">
        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isPending}
          {...register("password")}
          aria-label="Password input"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer"
          disabled={isPending}
          aria-label={showPassword ? "Hide password text" : "Show password text"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="flex items-center justify-between mt-1 select-none">
        <label className="flex items-center gap-2 text-xs text-[#334155] font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={rememberSession}
            onChange={(e) => setRememberSession(e.target.checked)}
            className="rounded border-[#E2E8F0] accent-[#0F172A]"
            disabled={isPending}
          />
          <span>Remember Session</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-xs text-[#0F172A] hover:underline font-bold"
        >
          Forgot Password?
        </Link>
      </div>

      <Button 
        type="submit" 
        isLoading={isPending} 
        className="w-full mt-2"
        aria-label="Submit login session"
      >
        Sign In
      </Button>
    </form>
  );
};
export default LoginForm;
