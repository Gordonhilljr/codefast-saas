"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const FormNewBoard = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      //1. Asychronous call to API to create new board
      const data = await axios.post("/api/board", { name });

      setName("");

      toast.success("Board Created!");

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
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Create a new feedback board</p>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Board Name:</legend>
        <input
          required
          type="text"
          className="input input-bordered w-full "
          placeholder="Future Ultra-Unicorn Inc!"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </fieldset>
      <button className="btn btn-primary w-full" type="submit">
        Create Board
        {isLoading && (
          <span className="loading loading-infinity loading-sm"></span>
        )}
      </button>
    </form>
  );
};

export default FormNewBoard;
