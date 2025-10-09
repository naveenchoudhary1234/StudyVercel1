import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { createCategory } from "../../../services/operation/categoryApi";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const { token } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");
    setLoading(true);
    try {
      const res = await createCategory({ name, description }, token);
      if (res) {
        toast.success("Category created successfully");
        setName("");
        setDescription("");
        // redirect to Add Course so the course form fetches categories
        navigate("/dashboard/add-course");
      }
    } catch (err) {
      toast.error(err.message || "Could not create category");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-style w-full"
            placeholder="Category name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-style w-full min-h-[120px]"
            placeholder="Optional description"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-richblack-300 py-2 px-4 font-semibold text-richblack-900"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
