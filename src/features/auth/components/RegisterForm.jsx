import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showToast } from "../../../store/toastSlice";
import { registerApi } from "../services/authApi";
import { InputField } from "../../../components/ui/InputField";
import { Button } from "../../../components/ui/Button";

// Strict production-grade password strength regexes
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const registerSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    username: z
      .string()
      .min(1, "Username is required")
      .refine((val) => !val.includes(" "), "Username cannot contain spaces"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // File Upload State
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [avatarError, setAvatarError] = useState("");
  const [coverError, setCoverError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setAvatarError("Avatar image file size must be less than 5MB");
      dispatch(showToast("Avatar size must be less than 5MB", "error"));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setAvatarError("Only JPG, PNG, and WebP formats are supported");
      dispatch(showToast("Only JPG, PNG, and WebP are supported", "error"));
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarError("");
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setCoverError("Cover banner file size must be less than 5MB");
      dispatch(showToast("Banner size must be less than 5MB", "error"));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setCoverError("Only JPG, PNG, and WebP formats are supported");
      dispatch(showToast("Only JPG, PNG, and WebP are supported", "error"));
      return;
    }

    setCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file));
    setCoverError("");
  };

  const onSubmit = async (data) => {
    if (!avatar) {
      setAvatarError("Avatar image is required");
      dispatch(showToast("Avatar image is required", "error"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("username", data.username.toLowerCase());
      formData.append("email", data.email);
      formData.append("password", data.password);
      
      formData.append("avatar", avatar);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await registerApi(formData);
      dispatch(showToast("Account registered successfully! Please sign in.", "success"));
      navigate("/login");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Registration failed. Please verify inputs.";
      dispatch(showToast(errorMsg, "error"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Create Account</h1>
        <p className="text-xs text-slate-400">Join our enterprise video CDN network</p>
      </div>

      <InputField
        label="Full Name"
        type="text"
        placeholder="Enter your first and last name"
        error={errors.fullname?.message}
        disabled={isSubmitting}
        {...register("fullname")}
      />

      <InputField
        label="Username"
        type="text"
        placeholder="Choose username (lowercase, no spaces)"
        error={errors.username?.message}
        disabled={isSubmitting}
        {...register("username")}
      />

      <InputField
        label="Email Address"
        type="email"
        placeholder="Enter email address"
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register("email")}
      />

      {/* Avatar input */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Profile Avatar (Required)</span>
        <div className="flex items-center gap-4">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border border-slate-800" />
          ) : (
            <div className="w-12 h-12 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-500 font-bold text-lg">+</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isSubmitting}
            className="hidden"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className="text-xs px-3 py-2 bg-slate-900 border border-slate-800 hover:border-brand-cyan hover:text-brand-cyan text-slate-300 rounded-lg cursor-pointer transition-colors duration-150">
            Select Avatar Image
          </label>
        </div>
        {avatarError && <span className="text-xs text-red-500">{avatarError}</span>}
      </div>

      {/* Cover Image input */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cover Banner (Optional)</span>
        <div className="flex items-center gap-4">
          {coverImagePreview ? (
            <img src={coverImagePreview} alt="Cover Preview" className="w-24 h-12 rounded-lg object-cover border border-slate-800" />
          ) : (
            <div className="w-24 h-12 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-500 font-bold text-lg">+</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            disabled={isSubmitting}
            className="hidden"
            id="cover-upload"
          />
          <label htmlFor="cover-upload" className="text-xs px-3 py-2 bg-slate-900 border border-slate-800 hover:border-brand-cyan hover:text-brand-cyan text-slate-300 rounded-lg cursor-pointer transition-colors duration-150">
            Select Cover Image
          </label>
        </div>
        {coverError && <span className="text-xs text-red-500">{coverError}</span>}
      </div>

      <InputField
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isSubmitting}
        {...register("password")}
      />

      <InputField
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isSubmitting}
        {...register("confirmPassword")}
      />

      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
        Register Account
      </Button>

      <div className="text-center text-xs text-slate-400 mt-2">
        Already have an account? <Link to="/login" className="text-brand-cyan hover:underline font-medium">Sign In Here</Link>
      </div>
    </form>
  );
};
export default RegisterForm;
