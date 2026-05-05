"use client";

import { useState, useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import type { Post } from "@/types";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader, Search } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await api.get("/posts");
      return res.data.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      api.post("/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowModal(false);
      setFormData({ title: "", content: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { title: string; content: string };
    }) => api.put(`/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowModal(false);
      setEditingPost(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const handleSubmit = () => {
    startTransition(() => {
      if (editingPost) {
        updateMutation.mutate({ id: editingPost.id, data: formData });
      } else {
        createMutation.mutate(formData);
      }
    });
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Posts</h1>
            <p className="text-sm text-base-content/60">
              Manage and explore your content
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered input-sm pl-8 w-52 focus:ring-2 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-2 top-2.5 opacity-50" />
            </div>

            <button
              className="btn btn-primary gap-2 rounded-xl"
              onClick={() => setShowModal(true)}
              disabled={isPending}
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-base-100 rounded-2xl shadow-md p-10 text-center">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-base-content/60 mb-4">
              Start by creating your first post
            </p>
            <button
              className="btn btn-primary rounded-xl"
              onClick={() => setShowModal(true)}
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-base-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => {
                        setEditingPost(post);
                        setFormData({
                          title: post.title,
                          content: post.content,
                        });
                        setShowModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => deleteMutation.mutate(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-base-content/70 mb-4 line-clamp-3">
                  {post.content}
                </p>

                <div className="flex justify-between items-center text-xs text-base-content/60">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-primary transition"
                  >
                    View Details →
                  </Link>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl rounded-2xl">
              <h3 className="text-xl font-bold mb-4">
                {editingPost ? "Edit Post" : "Create Post"}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />

                <textarea
                  placeholder="Write something..."
                  className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-primary"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>

              <div className="modal-action mt-6">
                <button
                  className="btn rounded-xl"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPost(null);
                    setFormData({ title: "", content: "" });
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary rounded-xl"
                  onClick={handleSubmit}
                  disabled={isPending || !formData.title || !formData.content}
                >
                  {isPending ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : editingPost ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
