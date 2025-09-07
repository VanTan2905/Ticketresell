import React, { useState } from "react";
import { Chatbox } from "./RequestForm";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  setChatboxData: React.Dispatch<React.SetStateAction<any[]>>;
  titleError: string | null;
  descriptionError: string | null;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  onSend,
  title,
  setTitle,
  description,
  setDescription,
  titleError,
  descriptionError
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        open ? "visible" : "invisible"
      }`}
    >
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button type="button" onClick={onClose}>
            x
          </button>
        </div>

        <form onSubmit={onSend} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiêu đề</label>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100 focus:border-transparent"
            />
            {titleError && <p className="text-red-500 text-xs">{titleError}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <textarea
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100 focus:border-transparent"
              rows={3}
            ></textarea>
            {descriptionError && <p className="text-red-500 text-xs">{descriptionError}</p>}
          </div>
          <div className="flex justify-end space-x-3 p-4">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow focus:outline-none "
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Hủy
      </button>
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md   "
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Gửi
      </button>
    </div>
        </form>
      </div>
    </div>
  );
};

const DialogComponent: React.FC<{
  chatboxData: Chatbox[];
  setChatboxData: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({ chatboxData, setChatboxData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setTitleError(null);
    setDescriptionError(null);
  };

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Title Validation
    if (!validateTitle(title)) return;

    // Description Validation
    if (!validateDescription(description)) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Chatbox/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chatboxId: "string",
            title,
            status: 0,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tạo chatbox");
      }

      const data = await response.json();
      setChatboxData(prevData => [data.data, ...prevData]);
      console.log('Success:', data);
      handleClose();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const isDisabled = chatboxData.some(chatbox => chatbox.status === 1);
  const validateTitle = (title: string): boolean => {
    if (/\d/.test(title)) {
      setTitleError("Tiêu đề không được chứa số.");
      return false;
    } else if (title.length < 5 || title.length > 90) {
      setTitleError("Tiêu đề phải có từ 5 đến 90 ký tự.");
      return false;
    } else {
      setTitleError(null);
      return true;
    }
  };

  const validateDescription = (description: string): boolean => {
    if (description.length > 200) {
      setDescriptionError("Mô tả không được vượt quá 200 ký tự.");
      return false;
    } else {
      setDescriptionError(null);
      return true;
    }
  };

  return (
    <>
      <button
        className={`border border-gray-300 rounded-full mb-5 px-4 py-2 text-white ${
          isDisabled ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={handleOpen}
        disabled={isDisabled}
      >
        Thêm
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        onSend={handleSend}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        setChatboxData={setChatboxData}
        titleError={titleError}
        descriptionError={descriptionError}
      />
    </>
  );
};

export default DialogComponent;
