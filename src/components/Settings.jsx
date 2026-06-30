import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { setUser } from "../features/auth/authSlice";
import { showToast } from "../store/toastSlice";
import { apiClient } from "../services/apiClient";
import { changePasswordApi } from "../features/auth/services/authApi";
import { InputField } from "./ui/InputField";
import { Button } from "./ui/Button";
import { User, ShieldAlert } from "lucide-react";

// Schemas for forms validation
const detailsSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Form 1: Details Update
  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: errorsDetails, isSubmitting: isUpdatingAccount },
  } = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
    },
  });

  // Form 2: Password Change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword, isSubmitting: isChangingPassword },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUpdateDetails = async (data) => {
    try {
      const response = await apiClient.patch("/users/update-account", {
        fullname: data.fullname,
        email: data.email,
      });
      if (response.data?.data) {
        dispatch(
          setUser({
            ...user,
            fullname: response.data.data.fullname,
            email: response.data.data.email,
          })
        );
      }
      dispatch(showToast("Account details updated successfully", "success"));
    } catch (error) {
      dispatch(showToast(error?.response?.data?.message || "Failed to update profile", "error"));
    }
  };

  const onChangePassword = async (data) => {
    try {
      await changePasswordApi({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      dispatch(showToast("Password changed successfully", "success"));
      resetPassword();
    } catch (error) {
      dispatch(showToast(error?.response?.data?.message || "Failed to modify password", "error"));
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Account Settings</h1>
      <p className="text-xs text-slate-400 mb-8">Configure user credentials, channel profiles, and authorization tokens</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <section className="rounded-xl glassmorphism p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-brand-cyan">
            <User size={18} />
            <h2 className="text-base font-semibold text-slate-100">Profile Details</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Edit your contact details and naming parameters displayed across channel search profiles.
          </p>

          <form onSubmit={handleSubmitDetails(onUpdateDetails)} className="flex flex-col gap-4 flex-grow">
            <InputField
              label="Full Name"
              type="text"
              error={errorsDetails.fullname?.message}
              disabled={isUpdatingAccount}
              {...registerDetails("fullname")}
            />

            <InputField
              label="Email Address"
              type="email"
              error={errorsDetails.email?.message}
              disabled={isUpdatingAccount}
              {...registerDetails("email")}
            />

            <Button type="submit" isLoading={isUpdatingAccount} className="w-full mt-auto">
              Save Profile Changes
            </Button>
          </form>
        </section>

        {/* Security Settings */}
        <section className="rounded-xl glassmorphism p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-brand-cyan">
            <ShieldAlert size={18} />
            <h2 className="text-base font-semibold text-slate-100">Security & Password</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Alter your security key token. Ensure your new passphrase uses multiple character blocks.
          </p>

          <form onSubmit={handleSubmitPassword(onChangePassword)} className="flex flex-col gap-4">
            <InputField
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={errorsPassword.oldPassword?.message}
              disabled={isChangingPassword}
              {...registerPassword("oldPassword")}
            />

            <InputField
              label="New Password"
              type="password"
              placeholder="••••••••"
              error={errorsPassword.newPassword?.message}
              disabled={isChangingPassword}
              {...registerPassword("newPassword")}
            />

            <InputField
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              error={errorsPassword.confirmPassword?.message}
              disabled={isChangingPassword}
              {...registerPassword("confirmPassword")}
            />

            <Button type="submit" isLoading={isChangingPassword} className="w-full mt-2">
              Update Password
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};
export default SettingsPage;
