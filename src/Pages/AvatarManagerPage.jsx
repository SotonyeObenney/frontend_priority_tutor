import React, { useState, useRef } from "react";
import {
  Camera,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { apiFetch } from "../api";
import { useAuth } from "../context/AuthContext";

/**
 * AvatarManagerPage — "Ink and Sun" Palette
 * ------------------------------------------------------------
 * Handles avatar uploading (POST /users/upload_avatar with multipart/form-data)
 * and avatar deletion (DELETE /users/delete_avatar).
 *
 * How the picture updates:
 *   - After every upload/delete this page stores the new avatar in LOCAL state
 *     (`override`), so the picture on this page always updates immediately.
 *   - It also pushes the change into the global user (if setUser exists) so
 *     other components such as the navbar can update too.
 *   - `version` is a frontend-only timestamp used as a cache-buster (?v=).
 */

export default function AvatarManagerPage() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const avatarUrl = `https://localhost:5000/users/get_avatar`;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Local source of truth after an upload/delete: { filename, version } or null
  const [override, setOverride] = useState(null);

  // What the page should currently show
  const currentFilename = override ? override.filename : user?.avatar_filename;
  const currentVersion = override?.version ?? user?.avatar_version ?? 0;
  const hasAvatar = Boolean(currentFilename);

  // Compute initials for standard Ink & Sun avatar display
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Update this page immediately, and the global user when possible
  const applyAvatar = (filename) => {
    const version = Date.now();
    setOverride({ filename, version });

    if (typeof setUser === "function") {
      setUser((prev) => ({
        ...prev,
        avatar_filename: filename,
        avatar_version: version,
      }));
    }
  };

  // Release the temporary blob URL created for the preview
  const clearPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side extension validation (jpg, jpeg, png, gif)
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setError("Please select a valid image file (JPG, PNG, or GIF).");
      return;
    }

    setError("");
    setSuccess("");
    clearPreview();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload Avatar handler (POST /users/upload_avatar)
  const handleUploadAvatar = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Build FormData for multipart file upload
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      // Call apiFetch without forcing Content-Type so browser sets boundary
      const response = await apiFetch("users/upload_avatar", {
        method: "POST",
        body: formData,
      });

      // Use the filename from the upload response if the backend sends it,
      // otherwise ask the server who the current user is and read it from there.
      let newFilename = response?.avatar_filename;
      if (!newFilename) {
        const me = await apiFetch("auth/me");
        newFilename = me?.user?.avatar_filename ?? null;
      }

      applyAvatar(newFilename);
      setSuccess("Avatar updated successfully!");

      // Reset selection state
      clearPreview();
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(
        err?.data?.error ||
          (typeof err?.data === "string" ? err.data : "") ||
          err?.message ||
          "Failed to upload avatar. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete Avatar handler (DELETE /users/delete_avatar)
  const handleDeleteAvatar = async () => {
    if (!hasAvatar) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("users/delete_avatar", {
        method: "DELETE",
      });

      applyAvatar(null);
      setSuccess("Avatar deleted successfully.");
      setConfirmDelete(false);
      clearPreview();
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(
        err?.data?.error ||
          (typeof err?.data === "string" ? err.data : "") ||
          err?.message ||
          "Failed to delete avatar. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelSelection = () => {
    clearPreview();
    setSelectedFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* Card Surface */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-navy">
              Profile Avatar
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Change or remove your profile avatar picture.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 p-3 text-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Avatar Preview Section */}
          <div className="mb-8 flex flex-col items-center justify-center sm:flex-row sm:justify-start sm:gap-6">
            <div className="relative mb-4 sm:mb-0">
              {/* Avatar circle with gold ring */}
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-navy ring-2 ring-gold/50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : hasAvatar ? (
                  <img
                    // key forces React to replace the <img> whenever the avatar changes
                    key={`${currentFilename}-${currentVersion}`}
                    src={`${avatarUrl}/${currentFilename}?v=${currentVersion}`}
                    alt={user?.full_name || "User Avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-cream">
                    {initials}
                  </span>
                )}
              </div>

              {/* Upload trigger overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Select avatar file"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-navy text-cream ring-2 ring-white hover:scale-105"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-navy">
                {user?.full_name || "Your Account"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                JPG, PNG or GIF up to 5MB
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs font-semibold text-gold hover:underline"
              >
                Choose new file
              </button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/gif"
            className="hidden"
          />

          {/* Action Area */}
          <div className="space-y-4">
            {selectedFile ? (
              /* Save/Cancel controls when a new file is pending upload */
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleUploadAvatar}
                  disabled={loading}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-semibold text-cream transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {loading ? "Uploading..." : "Save new avatar"}
                </button>
                <button
                  type="button"
                  onClick={cancelSelection}
                  disabled={loading}
                  className="flex h-10 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-navy hover:bg-cream"
                >
                  Cancel
                </button>
              </div>
            ) : (
              /* Delete section: always visible, disabled when there is no avatar */
              <div className="border-t border-gray-200 pt-6">
                {confirmDelete && hasAvatar ? (
                  <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                    <p className="mb-3 text-xs font-medium text-navy">
                      Are you sure you want to delete your profile avatar?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        disabled={loading}
                        className="flex h-9 flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white text-xs font-semibold text-navy hover:bg-cream"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={loading}
                        className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-danger px-3 text-xs font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {loading ? "Deleting..." : "Confirm Delete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      disabled={!hasAvatar || loading}
                      title={
                        hasAvatar
                          ? "Delete your avatar"
                          : "You don't have an avatar to delete"
                      }
                      className="flex items-center gap-2 text-xs font-semibold text-danger hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline disabled:hover:no-underline"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete current avatar
                    </button>
                    {!hasAvatar && (
                      <p className="mt-1.5 text-xs text-gray-400">
                        You haven't uploaded an avatar yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
