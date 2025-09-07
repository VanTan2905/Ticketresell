"use client";
import { useState } from "react";

const UploadPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageId, setImageId] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageFile || !imageId) {
      alert("Please select an image and provide an ID.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("id", imageId); // Append the image ID

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">Image ID:</label>
          <input
            type="text"
            id="id"
            value={imageId}
            onChange={handleIdChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Choose Image:</label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadPage;
