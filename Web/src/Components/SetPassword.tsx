import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { RiLockPasswordFill } from "react-icons/ri";

// Password requirements
const PASSWORD_REQUIREMENTS = [
  { label: "Ít nhất 8 ký tự", test: (pwd: string) => pwd.length >= 8 },
  {
    label: "Chứa chữ in hoa",
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    label: "Chứa chữ thường",
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  { label: "Chứa số", test: (pwd: string) => /\d/.test(pwd) },
  {
    label: "Chứa ký tự đặc biệt",
    test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
] as const;

// Type definitions
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

interface SetPasswordProps {
  onSubmit: (password: string) => Promise<void>;
  title?: string;
  subtitle?: string;
}

// InputField component
const InputField: React.FC<InputFieldProps> = ({
  icon,
  rightIcon,
  onRightIconClick,
  error,
  ...props
}) => (
  <div className="relative mt-5">
    <div className="absolute inset-y-0 left-0 flex top-5 pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      className={`w-full pl-10 pr-10 py-4 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 
        ${
          error ? "ring-2 ring-red-500" : "focus:ring-green-500"
        } transition-all`}
      {...props}
    />
    {rightIcon && (
      <button
        type="button"
        onClick={onRightIconClick}
        className="absolute inset-y-0 right-0 flex top-5 pr-3 text-gray-400 hover:text-gray-600"
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

// ActionButton component
const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  isLoading,
  type = "button",
}) => (
  <button
    type={type}
    className="w-full px-4 py-4 mt-6 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 
      focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 
      transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
      </div>
    ) : (
      children
    )}
  </button>
);

const SetPassword: React.FC<SetPasswordProps> = ({
  onSubmit,
  title = "Đặt Mật Khẩu",
  subtitle = "Vui lòng đặt mật khẩu mới",
}) => {
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
      newErrors.newPassword = "Password does not meet the requirements";
      setErrors(newErrors);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData.newPassword);
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to set password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-20 p-10 max-w-lg mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold">
              <span className="text-green-500">Ticket</span>
              <span className="text-black">Resell</span>
            </h1>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-2">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                Đặt Mật Khẩu
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
