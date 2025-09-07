type FetchImageResult = {
  imageUrl: string | null;
  error: string | null;
};

export async function fetchImage(imageId: string): Promise<FetchImageResult> {
  if (!imageId) {
    return {
      imageUrl: null,
      error: "Please provide an ID",
    };
  }

  try {
    const response = await fetch(`/api/images/${imageId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          imageUrl: null,
          error: "Image not found. Please check the ID and try again.",
        };
      }
      throw new Error(`Server error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return {
      imageUrl: url,
      error: null,
    };
  } catch (error) {
    console.error("Error retrieving image:", error);
    return {
      imageUrl: null,
      error:
        error instanceof Error
          ? error.message
          : "Error retrieving image. Please try again.",
    };
  }
}
