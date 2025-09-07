import { deleteImage } from "./Deleteimage";

const uploadImageForTicket = async (id: string, selectedFile: File | null) => {
  if (!selectedFile) {
    console.error("Không có tệp nào được chọn để tải lên.");
    return null;
  }

  const formData = new FormData();
  formData.append("id", id); // Đảm bảo `ticket.Image` chứa ID đúng
  formData.append("image", selectedFile);

  try {

    const deleteImageResult = await deleteImage(id);
    console.log("Kết quả xóa hình ảnh:", deleteImageResult);

    const uploadResponse = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Lỗi khi tải lên hình ảnh: ${uploadResponse.statusText}`);
    }
    if (!uploadResponse.ok) {
      throw new Error(`Lỗi khi tải lên hình ảnh: ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log("Kết quả tải lên:", uploadResult); // Ghi log kết quả tải lên

    return uploadResult;
  } catch (error) {
    console.error("Lỗi trong quá trình cập nhật hình ảnh:", error);
    return null;
  }
};

export default uploadImageForTicket;