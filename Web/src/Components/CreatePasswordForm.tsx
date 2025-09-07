import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { motion } from "framer-motion";
import { RiLockPasswordFill } from "react-icons/ri";

// Password requirements constant remains the same
export const PASSWORD_REQUIREMENTS = [
  { label: "Ít nhất 8 ký tự", test: (pwd: string) => pwd.length >= 8 },
  {
    label: "Chứa chữ cái viết hoa",
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    label: "Chứa chữ cái viết thường",
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  { label: "Chứa số", test: (pwd: string) => /\d/.test(pwd) },
  {
    label: "Chứa ký tự đặc biệt",
    test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
] as const;

interface Params {
  key?: string;
  to?: string;
}
// Type definitions remain the same
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.FormEvent) => void;
  isLoading?: boolean;
  type?: "button" | "submit";
}

// InputField component remains the same
export const InputField: React.FC<InputFieldProps> = ({
  icon,
  rightIcon,
  onRightIconClick,
  error,
  ...props
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 top-5 left-0 flex  pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      className={`w-full pl-10 pr-10 py-3 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 
        ${
          error ? "ring-2 ring-red-500" : "focus:ring-green-500"
        } transition-all`}
      {...props}
    />
    {rightIcon && (
      <button
        type="button"
        onClick={onRightIconClick}
        className="absolute inset-y-0 top-5 right-0 flex pr-3 text-gray-400 hover:text-gray-600"
      >
        {rightIcon}
      </button>
    )}
    {error && (
      <Alert variant="destructive" className="mt-2 border-white">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  </div>
);

// ActionButton component remains the same
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  isLoading,
  type = "button",
}) => (
  <motion.button
    type={type}
    className="w-full px-4 py-4 mt-6 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 
      focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 
      transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={isLoading}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Đang xử lý...
      </div>
    ) : (
      children
    )}
  </motion.button>
);

const CreatePasswordForm: React.FC = () => {
  // Update URL parameter handling
  const urlParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const to = urlParams ? urlParams.get("to") : null;
  const key = urlParams ? urlParams.get("key") : null;

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    return PASSWORD_REQUIREMENTS.every((req) => req.test(password));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Mật khẩu không đáp ứng yêu cầu";
      setErrors(newErrors);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/change-passwordKey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: to,
            passwordKey: key,
            newPassword: formData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thay đổi mật khẩu thất bại");
      }

      // Handle success
      window.location.href = "/login"; // Redirect to login page after success
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi thay đổi mật khẩu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-20 p-10 max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold">
              <span className="text-green-500">Ticket</span>
              <span className="text-black">Resell</span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
              <p className="text-gray-600 mt-2">Vui lòng đổi mật khẩu mới</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-9">
              <div>
                <InputField
                  icon={<RiLockPasswordFill />}
                  rightIcon={
                    showPassword.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )
                  }
                  type={showPassword.new ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onRightIconClick={() =>
                    setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                  }
                  error={errors.newPassword}
                />
              </div>
              <InputField
                icon={<RiLockPasswordFill />}
                rightIcon={
                  showPassword.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )
                }
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onRightIconClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                error={errors.confirmPassword}
              />

              {errors.submit && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              <ActionButton type="submit" isLoading={isLoading}>
                Đổi mật khẩu
              </ActionButton>

              <div className="mt-4 space-y-2">
                {PASSWORD_REQUIREMENTS.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center text-sm ${
                      req.test(formData.newPassword)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="mr-2">
                      {req.test(formData.newPassword) ? "✓" : "○"}
                    </span>
                    {req.label}
                  </div>
                ))}
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreatePasswordForm;
