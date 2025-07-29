"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ButtonUpvote = ({ post, onVoteUpdate }) => {
  const localStorageKeyName = `codef4stSaaS-hasVoted-${post._id}`;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(post.votesCounter || 0);

  // Check if current user has already voted
  useEffect(() => {
    if (session?.user?.id && post.voters) {
      // Since voters is now an array of strings after serialization
      setHasVoted(post.voters.includes(session.user.id));
    }
  }, [session, post.voters]);

  useEffect(() => {
    setHasVoted(localStorage.getItem(localStorageKeyName) === "true");
  }, []);
  const handleVote = async () => {
    if (!session) {
      // Could redirect to login or show a message
      alert("Please sign in to vote");
      return;
    }

    setIsLoading(true);

    try {
      const method = hasVoted ? "DELETE" : "POST";
      const response = await fetch(`/api/vote?postId=${post._id}`, {
        method,
      });

      if (response.ok) {
        const newVoteCount = hasVoted ? voteCount - 1 : voteCount + 1;
        setVoteCount(newVoteCount);
        setHasVoted(!hasVoted);
        localStorage.removeItem(localStorageKeyName);

        // Call parent callback if provided
        if (onVoteUpdate) {
          onVoteUpdate(post._id, newVoteCount, !hasVoted);
        }
      } else {
        throw new Error("Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      className={`
        btn btn-square relative transition-all duration-200
        ${
          hasVoted
            ? "btn-primary bg-primary border-primary text-primary-content"
            : "btn-outline hover:btn-primary"
        }
        ${isLoading ? "loading" : ""}
      `}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`
              size-4 transition-transform duration-200
              ${hasVoted ? "scale-110" : ""}
            `}
          >
            <path
              fillRule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
              clipRule="evenodd"
              transform="rotate(180 8 8)"
            />
          </svg>
          <span className="text-xs font-bold mt-0.5">{voteCount}</span>
        </div>
      )}
    </button>
  );
};

export default ButtonUpvote;
