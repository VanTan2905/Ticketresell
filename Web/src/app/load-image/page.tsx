"use client";
import React, { useState } from "react";

const RetrievePage = () => {
  const [imageId, setImageId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setImageUrl("");

    if (!imageId) {
      setError("Please provide an ID");
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Fetching image from: /api/images/${imageId}`);

      const response = await fetch(`/api/images/${imageId}`);

      if (!response.ok) {
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);

        if (response.status === 404) {
          throw new Error(
            "Image not found. Please check the ID and try again."
          );
        }
        throw new Error(`Server error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("Error retrieving image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error retrieving image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Retrieve Image</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image ID:
          </label>
          <input
            type="text"
            id="_id"
            value={imageId}
            onChange={handleIdChange}
            placeholder="Enter image ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Retrieve Image"}
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Retrieved Image:
          </h2>
          <img
            src={imageUrl}
            alt="Retrieved image"
            className="max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default RetrievePage;
