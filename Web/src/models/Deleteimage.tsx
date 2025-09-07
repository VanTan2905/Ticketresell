type DeleteImageResult = {
    success: boolean;
    error: string | null;
  };
  
  export async function deleteImage(imageId: string): Promise<DeleteImageResult> {
    if (!imageId) {
      return {
        success: false,
        error: "Please provide an image ID",
      };
    }
  
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Image not found. Please check the ID and try again.",
          };
        }
        throw new Error(`Server error: ${response.statusText}`);
      }
  
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error("Error deleting image:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error deleting image. Please try again.",
      };
    }
  }
  