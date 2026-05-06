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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);


  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const res = await api.get(`/posts?page=${page}`);
      return res.data.data;
    },
  });

  const posts = data?.data || [];
  const currentPage = data?.current_page || 1;
  const lastPage = data?.last_page || 1;

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowDeleteModal(false);
      setDeletingPost(null);
    },
  });

  const handleDelete = (post: Post) => {
    setDeletingPost(post);
    setShowDeleteModal(true);
  };



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
    (p: Post) =>
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
                className="input input-bordered input-sm pl-8 w-52"
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
            <button
              className="btn btn-primary mt-4"
              onClick={() => setShowModal(true)}
            >
              Create Post
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {filteredPosts.map((post: Post) => (
                <div
                  key={post.id}
                  className="bg-base-100 rounded-2xl shadow-md p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{post.title}</h3>

                    {String(user?.id) === String(post.user_id) && (
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
                          onClick={() => handleDelete(post)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    )}
                  </div>

                  <p className="text-sm mb-3">{post.content}</p>

                  <div className="flex justify-between text-xs opacity-70">
                    <Link href={`/posts/${post.id}`}>Detail →</Link>
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center mt-6 gap-2">
              <div className="join">
                <button
                  className="join-item btn"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  «
                </button>

                <button className="join-item btn">
                  Page {currentPage} / {lastPage}
                </button>

                <button
                  className="join-item btn"
                  disabled={currentPage === lastPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  »
                </button>
              </div>

              <p className="text-sm opacity-60">
                Showing page {currentPage} of {lastPage}
              </p>
            </div>
          </>
        )}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                {editingPost ? "Edit Post" : "Create Post"}
              </h3>

              <input
                className="input input-bordered w-full mt-4"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <textarea
                className="textarea textarea-bordered w-full mt-4"
                placeholder="Content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />

              <div className="modal-action">
                <button className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={handleSubmit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && deletingPost && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete Post</h3>
              <p className="py-2 text-sm opacity-80">
                Are you sure you want to delete this post?
              </p>
              <div className="bg-base-200 rounded-xl p-3 text-sm">
                <div className="font-semibold">{deletingPost.title}</div>
              </div>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingPost(null);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteMutation.mutate(deletingPost.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
