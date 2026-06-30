import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChannelApi, updateAvatarApi, updateCoverImageApi } from "../services/channelApi";
import { setUser } from "../../auth/authSlice";
import { showToast } from "../../../store/toastSlice";
import { Avatar } from "../../../components/ui/Avatar";
import { Button } from "../../../components/ui/Button";
import { Camera, Mail, Users, UserCheck } from "lucide-react";

export const ChannelProfile = () => {
  const { username } = useParams();
  const { user } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("videos");
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const isOwnProfile = user?.username === username;

  // React Query query
  const { data: channel, isLoading, error } = useQuery({
    queryKey: ["channel", username],
    queryFn: async () => {
      const response = await getChannelApi(username || "");
      return response.data;
    },
    enabled: !!username,
  });

  // React Query mutations
  const avatarMutation = useMutation({
    mutationFn: updateAvatarApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channel", username] });
      if (isOwnProfile && data?.data) {
        dispatch(setUser({ ...user, avatar: data.data.avatar }));
      }
      dispatch(showToast("Avatar image updated successfully", "success"));
    },
    onError: (err) => {
      dispatch(showToast(err?.response?.data?.message || "Failed to update avatar", "error"));
    },
  });

  const coverMutation = useMutation({
    mutationFn: updateCoverImageApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channel", username] });
      if (isOwnProfile && data?.data) {
        dispatch(setUser({ ...user, coverImage: data.data.coverImage }));
      }
      dispatch(showToast("Cover banner updated successfully", "success"));
    },
    onError: (err) => {
      dispatch(showToast(err?.response?.data?.message || "Failed to update cover banner", "error"));
    },
  });

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      avatarMutation.mutate(formData);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("coverImage", file);
      coverMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-brand-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="text-center py-20 px-4 text-slate-400">
        <h2 className="text-xl font-bold text-slate-200 mb-2">Channel Not Found</h2>
        <p className="text-xs">The channel you are looking for does not exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-fade-in">
      {/* Hidden file selectors */}
      {isOwnProfile && (
        <>
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverFileChange}
            accept="image/*"
            className="hidden"
          />
        </>
      )}

      {/* Cover Banner section */}
      <div className="w-full h-[200px] md:h-[280px] relative bg-slate-900 overflow-hidden">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-brand-cyan/10 to-brand-indigo/10" />
        )}
        {isOwnProfile && (
          <button 
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg glassmorphism text-xs font-medium text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
            onClick={() => coverInputRef.current?.click()}
            disabled={coverMutation.isPending}
            aria-label="Edit cover banner"
          >
            <Camera size={14} />
            <span>Update Banner</span>
          </button>
        )}
      </div>

      {/* Profile Info row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 px-6 md:px-12 -mt-12 relative z-10">
        <div className="relative w-24 h-24 rounded-full border-4 border-dark-base bg-dark-base shadow-xl flex-shrink-0">
          <Avatar src={channel.avatar} name={channel.fullname} size="xl" className="w-full h-full" />
          {isOwnProfile && (
            <button 
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-150 cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarMutation.isPending}
              aria-label="Edit avatar picture"
            >
              <Camera size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-col flex-grow pb-2">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start w-full">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{channel.fullname}</h1>
              <p className="text-xs text-slate-400 mt-0.5">@{channel.username}</p>
            </div>
            {!isOwnProfile && (
              <Button 
                variant={channel.isSubscribed ? "outline" : "solid"}
                className="rounded-full shadow-lg"
              >
                {channel.isSubscribed ? (
                  <>
                    <UserCheck size={16} />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </Button>
            )}
          </div>
          
          <div className="flex gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={14} />
              <span><strong>{channel.subscribersCount}</strong> Subscribers</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={14} />
              <span><strong>{channel.channelsSubscribedToCount}</strong> Subscribed Channels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu bar */}
      <div className="flex border-b border-slate-800 mt-8 px-6 md:px-12">
        <button
          className={`px-6 py-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "videos" ? "color-brand-cyan border-brand-cyan text-brand-cyan" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("videos")}
        >
          Catalog Videos
        </button>
        <button
          className={`px-6 py-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "about" ? "color-brand-cyan border-brand-cyan text-brand-cyan" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setActiveTab("about")}
        >
          About Channel
        </button>
      </div>

      {/* Content panel */}
      <div className="p-6 md:p-12">
        {activeTab === "videos" ? (
          <div className="text-center py-20 text-slate-500 text-xs bg-slate-900/10 border border-slate-800/40 rounded-xl">
            <p>This channel has not uploaded any videos yet.</p>
          </div>
        ) : (
          <div className="rounded-xl glassmorphism p-6 max-w-xl">
            <h3 className="text-sm font-semibold text-slate-100 mb-2">Channel Description</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Welcome to the corporate channel of {channel.fullname}. This space is utilized to distribute enterprise
              media, instructional videos, and system architectural updates.
            </p>
            <div className="border-t border-slate-800 pt-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail size={14} />
                <span>Contact: {channel.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChannelProfile;
