"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { set } from "mongoose";

const FormAddPost = ({ boardId }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      //1. Asychronous call to API to create new board
      await axios.post(`/api/post?boardId=${boardId}`, { title, description });

      setTitle("");
      setDescription("");

      toast.success("Post Added!");

      router.refresh();

      //2. Redirect to dedicated board page
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";

      toast.error(errorMessage);
      //1. Display error message
    } finally {
      //Stop loading spinner
      setIsLoading(false);
    }
  };
  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8 w-full md:w-96 shrink-0 md:sticky top-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Suggest a feature</p>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Short &amp; Descriptive Title:
        </legend>
        <input
          required
          type="text"
          className="input input-bordered w-full "
          placeholder="You should add more colors!"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
        />
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Description</legend>
        <textarea
          className="textarea h-24"
          placeholder="Bio"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={1000}
        ></textarea>
        <div className="label"></div>
      </fieldset>
      <button className="btn btn-primary w-full" type="submit">
        Add Post
        {isLoading && (
          <span className="loading loading-infinity loading-sm"></span>
        )}
      </button>
    </form>
  );
};

export default FormAddPost;
