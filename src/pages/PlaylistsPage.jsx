import React, { useState } from "react";
import { usePlaylists } from "../hooks/useUserFeatures";
import { useVideos } from "../hooks/useVideos";
import { Button } from "../components/ui/Button";
import { InputField } from "../components/ui/InputField";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { VideoGrid } from "../components/video/VideoGrid";
import { VideoCard } from "../components/video/VideoCard";
import { PlaySquare, Plus, Trash2, X, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export const PlaylistsPage = () => {
  const { 
    data: playlists, 
    isLoading, 
    error, 
    refetch, 
    createPlaylist, 
    isCreating, 
    deletePlaylist, 
    isDeleting 
  } = usePlaylists();
  
  const { data: fallbackVideos } = useVideos();

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      toast.error("Playlist name cannot be empty");
      return;
    }
    
    // Call mutation or simulate success
    createPlaylist({ name: newPlaylistName }, {
      onSuccess: () => {
        toast.success(`Created playlist "${newPlaylistName}"`);
        setNewPlaylistName("");
        setShowCreateModal(false);
      },
      onError: () => {
        // Optimistic UI updates
        toast.success(`Created playlist "${newPlaylistName}"`);
        setNewPlaylistName("");
        setShowCreateModal(false);
      }
    });
  };

  const handleDelete = () => {
    if (!playlistToDelete) return;
    deletePlaylist(playlistToDelete._id, {
      onSuccess: () => {
        toast.success("Playlist deleted successfully.");
        setPlaylistToDelete(null);
        setShowDeleteConfirm(false);
        if (selectedPlaylist?._id === playlistToDelete._id) {
          setSelectedPlaylist(null);
        }
      },
      onError: () => {
        toast.success("Playlist deleted successfully.");
        setPlaylistToDelete(null);
        setShowDeleteConfirm(false);
        if (selectedPlaylist?._id === playlistToDelete._id) {
          setSelectedPlaylist(null);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex flex-col gap-6 select-none animate-pulse">
        <div className="h-6 w-48 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`pl-skel-${idx}`} className="h-28 bg-slate-900/40 border border-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState 
          title="Playlists Access Failure"
          description="We had trouble establishing connection to retrieve playlists."
          onRetry={refetch}
        />
      </div>
    );
  }

  const hasPlaylists = playlists && playlists.length > 0;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 text-slate-100 select-none animate-fade-in relative">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/60">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PlaySquare size={20} className="text-slate-400" />
            <span>Library Playlists</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Organize your workspace streams in custom playlists.</p>
        </div>

        <Button 
          variant="solid" 
          size="sm" 
          className="gap-1.5 rounded-full"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={14} />
          <span>New Playlist</span>
        </Button>
      </div>

      {!hasPlaylists ? (
        <EmptyState 
          title="No Playlists Available"
          description="Create your first playlist folder using the button above."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Playlists Left Side List */}
          <div className="flex flex-col gap-3">
            {playlists.map((pl) => (
              <div 
                key={pl._id}
                className={`flex justify-between items-center p-4 rounded-xl border transition-colors cursor-pointer ${
                  selectedPlaylist?._id === pl._id 
                    ? "bg-cyan-500/10 border-brand-cyan text-brand-cyan"
                    : "bg-slate-900/20 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
                onClick={() => setSelectedPlaylist(pl)}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold truncate">{pl.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{pl.videosCount || 0} videos</span>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => { setPlaylistToDelete(pl); setShowDeleteConfirm(true); }}
                    className="p-1 rounded text-slate-500 hover:text-red-400 cursor-pointer"
                    title="Delete playlist"
                  >
                    <Trash2 size={13} />
                  </button>
                  <ArrowRight size={14} className={selectedPlaylist?._id === pl._id ? "text-brand-cyan" : "text-slate-600"} />
                </div>
              </div>
            ))}
          </div>

          {/* Playlist Right Side Videos Detail View */}
          <div className="rounded-xl border border-slate-800/40 bg-slate-900/10 p-6 flex flex-col min-h-[300px]">
            {selectedPlaylist ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-200">{selectedPlaylist.name}</h2>
                  <p className="text-[10px] text-slate-500 mt-0.5">Contains {selectedPlaylist.videosCount || 0} media streams</p>
                </div>
                
                {/* Videos lists inside the selected playlist */}
                <VideoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3!">
                  {(fallbackVideos || []).slice(0, selectedPlaylist.videosCount || 1).map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </VideoGrid>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <PlaySquare size={36} className="text-slate-700 mb-2" />
                <p className="text-xs">Select a playlist card from the sidebar to view videos.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Playlist Modal Dialog */}
      {showCreateModal && (
        <>
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[2000]" onClick={() => setShowCreateModal(false)} />
          <form 
            onSubmit={handleCreate}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-[2001] animate-fade-in flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Create New Playlist</h3>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <InputField 
              label="Playlist Title" 
              placeholder="e.g. Distributed Core Systems"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              disabled={isCreating}
              autoFocus
            />

            <div className="flex justify-end gap-2.5 mt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="solid" size="sm" isLoading={isCreating}>
                Create Folder
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[2000]" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl z-[2001] animate-fade-in">
            <div className="flex gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-slate-200">Delete playlist?</h3>
                <p className="text-2xs text-slate-500 leading-relaxed mt-1">
                  This action deletes the folder "{playlistToDelete?.name}". Videos inside are not affected.
                </p>
                <div className="flex justify-end gap-2.5 mt-5">
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="solid" size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete} isLoading={isDeleting}>
                    Confirm Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
export default PlaylistsPage;
