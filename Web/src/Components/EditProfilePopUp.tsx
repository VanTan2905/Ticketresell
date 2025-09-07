import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/Hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import InputAddressFields from "@/Hooks/locationInputTemplate";
import { motion } from "framer-motion";
import { RiLockPasswordFill } from "react-icons/ri";
import { PASSWORD_REQUIREMENTS } from "./CreatePasswordForm"; // You might need to adjust this import path
import { InputField, ActionButton } from "./CreatePasswordForm"; // You might need to adjust this import path
interface FormData {
  userid: string;
  fullName: string | undefined;
  sex: string | undefined;
  phone: string | undefined;
  address: string | undefined;
  birthday: string | undefined;
  bio: string | undefined;
}

interface EditProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormData; // Chỉ định initialData là tùy chọn
  userId: string;
  onSave: (data: FormData) => void;
}

interface PasswordChangeProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
  initialData?: FormData; // Chỉ định initialData là tùy chọn
}

interface Passwords {
  current: string;
  new: string;
  confirm: string;
}

interface PasswordErrors {
  current?: string;
  new?: string;
  confirm?: string;
}

interface Errors {
  [key: string]: string; // Định nghĩa rằng key có thể là bất kỳ chuỗi nào và value là một chuỗi
}

// API function for updating user profile
const updateUserProfile = async (userId: string, data: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/User/update/${userId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Password validation
const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength)
    errors.push(`Mật khẩu phải có ít nhất ${minLength} ký tự`);
  if (!hasUpperCase)
    errors.push("Mật khẩu phải chứa ít nhất một chữ cái viết hoa");
  if (!hasLowerCase)
    errors.push("Mật khẩu phải chứa ít nhất một chữ cái viết thường");
  if (!hasNumbers) errors.push("Mật khẩu phải chứa ít nhất một số");
  if (!hasSpecialChar)
    errors.push("Mật khẩu phải chứa ít nhất một ký tự đặc biệt");

  return errors;
};

// Form validation
const validateForm = (formData: FormData) => {
  const errors: { [key: string]: string } = {};

  // Name validation
  if (!formData.fullName?.trim()) {
    errors.fullName = "Họ tên không được để trống";
  } else if (formData.fullName.length < 2 || formData.fullName.length > 50) {
    errors.fullName = "Họ tên phải từ 2 đến 50 ký tự";
  } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName)) {
    errors.fullName = "Họ tên chỉ được chứa chữ cái và khoảng trắng";
  }

  // Phone validation
  if (!formData.phone?.trim()) {
    errors.phone = "Số điện thoại không được để trống";
  } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.phone.trim())) {
    errors.phone =
      "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và có 10 số)";
  }

  // Sex validation
  if (!formData.sex) {
    errors.sex = "Vui lòng chọn giới tính";
  } else if (!["male", "female", "other"].includes(formData.sex)) {
    errors.sex = "Giới tính không hợp lệ";
  }

  // Bio validation
  if (!formData.bio?.trim()) {
    errors.bio = "Tiểu sử không được để trống";
  } else if (formData.bio && formData.bio.length > 500) {
    errors.bio = "Tiểu sử không được vượt quá 500 ký tự";
  }
  // Birthday validation
  if (!formData.birthday?.trim()) {
    errors.birthday = "Ngày sinh không được để trống";
  } else {
    const selectedDate = new Date(formData.birthday);
    if (isNaN(selectedDate.getTime())) {
      errors.birthday = "Ngày sinh không hợp lệ";
    }
  }

  return errors;
};

// Password Change Component
// Password Change Component
const PasswordChange = ({ isOpen, setIsOpen, userId }: PasswordChangeProps) => {
  const { toast } = useToast(); // Use the Shadcn toast hook
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [passwords, setPasswords] = useState<Passwords>({
    current: "",
    new: "",
    confirm: "",
  });
  const handleChangePassword = async (userId: string, data: any) => {
    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/change-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserId: userId,
            CurrentPassword: passwords.current,
            NewPassword: passwords.new,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswords({
          current: "",
          new: "",
          confirm: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.title || "Error changing password"}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing the password.");
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords({
      ...passwords,
      [name]: value,
    });
    // Clear errors when user types
    if (errors[name as keyof PasswordErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const newPasswordErrors = validatePassword(passwords.new);
    if (newPasswordErrors.length > 0) {
      setErrors({ new: newPasswordErrors.join(". ") });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setErrors({ confirm: "Passwords don't match" });
      return;
    }

    try {
      setIsLoading(true);
      // Add your password update API call here
      await handleChangePassword(userId, {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      // Using the Shadcn toast method
      toast({
        title: "Success",
        description: "Password updated successfully.",
        variant: "default", // Variant for success message
        duration: 5000, // Duration in milliseconds (optional)
      });
      setIsOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";

      // Using the Shadcn toast method for errors
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive", // Indicating an error variant
        duration: 5000, // Duration in milliseconds (optional)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white rounded overflow-hidden p-6 max-w-md mx-auto mt-12">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Đổi mật khẩu
          </DialogTitle>
          <p className="text-md text-gray-600">Vui lòng nhập mật khẩu mới</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={<RiLockPasswordFill />}
            rightIcon={
              showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
            type={showPassword ? "text" : "password"}
            name="current"
            placeholder="Mật khẩu hiện tại"
            value={passwords.current}
            onChange={handlePasswordChange}
            onRightIconClick={() => setShowPassword(!showPassword)}
            error={errors.current}
            disabled={isLoading}
          />

          <InputField
            icon={<RiLockPasswordFill />}
            rightIcon={
              showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
            type={showPassword ? "text" : "password"}
            name="new"
            placeholder="Mật khẩu mới"
            value={passwords.new}
            onChange={handlePasswordChange}
            onRightIconClick={() => setShowPassword(!showPassword)}
            error={errors.new}
            disabled={isLoading}
          />

          <InputField
            icon={<RiLockPasswordFill />}
            rightIcon={
              showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )
            }
            type={showPassword ? "text" : "password"}
            name="confirm"
            placeholder="Xác nhận mật khẩu mới"
            value={passwords.confirm}
            onChange={handlePasswordChange}
            onRightIconClick={() => setShowPassword(!showPassword)}
            error={errors.confirm}
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-2 text-xs">
            {PASSWORD_REQUIREMENTS.map((req, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  req.test(passwords.new) ? "text-green-500" : "text-gray-500"
                }`}
              >
                <span className="mr-1">
                  {req.test(passwords.new) ? "✓" : "○"}
                </span>
                {req.label}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="rounded-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-full px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang cập nhật</span>
                </div>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Profile Edit Component
const EditProfilePopup: React.FC<EditProfilePopupProps> = ({
  isOpen,
  onClose,
  initialData,
  userId,
  onSave,
}) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [houseNumber, setHouseNumber] = useState<string>(" ");
  const { toast } = useToast();
  const [addressError, setAddressError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("personal");

  const validateAddress = () => {
    const addressErrors: { [key: string]: string } = {};

    if (!houseNumber.trim()) {
      addressErrors.houseNumber = "Vui lòng nhập số nhà/đường";
    }

    if (!formData.address) {
      const parts =
        formData.address?.split(",").map((part) => part.trim()) || [];

      if (!parts[3]) {
        addressErrors.province = "Vui lòng chọn tỉnh/thành phố";
      }
      if (!parts[2]) {
        addressErrors.district = "Vui lòng chọn quận/huyện";
      }
      if (!parts[1]) {
        addressErrors.ward = "Vui lòng chọn phường/xã";
      }
    }

    return addressErrors;
  };

  const HandleSubmitClick = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate personal information fields
    const personalInfoErrors = validateForm(formData);
    // Validate address fields
    const addressErrors = validateAddress();

    const allErrors = { ...personalInfoErrors, ...addressErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);

      // Check if personal information is valid but address has errors
      if (
        Object.keys(personalInfoErrors).length === 0 &&
        Object.keys(addressErrors).length > 0
      ) {
        setActiveTab("additional"); // Switch to "Thông Tin Thêm" tab if only address errors exist
      }

      toast({
        title: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin nhập vào",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateUserProfile(userId, formData);
      onSave(formData);
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công",
        variant: "default",
        duration: 5000,
      });
      onClose(); // Only close on success
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      userid: userId,
      fullName: "",
      sex: "",
      phone: "",
      address: "",
      birthday: "",
      bio: "",
    }
  );
  const handleBirthdayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      birthday: value,
    }));

    validateBirthday(value);
  };

  const validateBirthday = (birthday: string) => {
    const selectedDate = new Date(birthday);
    const today = new Date();

    const age = today.getFullYear() - selectedDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > selectedDate.getMonth() ||
      (today.getMonth() === selectedDate.getMonth() &&
        today.getDate() >= selectedDate.getDate());

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    if (finalAge < 18) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "Bạn phải từ đủ 18 tuổi.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "",
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the specific field
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sex: value }));

    // Validate sex field
    const fieldError = validateField("sex", value);
    setErrors((prev) => ({
      ...prev,
      sex: fieldError,
    }));
  };

  // Helper function to validate individual fields
  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "fullName":
        if (!value?.trim()) {
          return "Họ và tên không được để trống";
        }
        if (value.length < 2 || value.length > 50) {
          return "Họ tên phải từ 2 đến 50 ký tự";
        }
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          return "Họ tên chỉ được chứa chữ cái và khoảng trắng";
        }
        return "";

      case "phone":
        if (!value?.trim()) {
          return "Số điện thoại không được để trống";
        }
        if (!/^(0|\+84)[0-9]{9}$/.test(value.trim())) {
          return "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và có 10 số)";
        }
        return "";

      case "sex":
        if (!value) {
          return "Vui lòng chọn giới tính";
        }
        if (!["male", "female", "other"].includes(value)) {
          return "Giới tính không hợp lệ";
        }
        return "";

      case "bio":
        if (value && value.length > 500) {
          return "Tiểu sử không được vượt quá 500 ký tự";
        }
        return "";

      case "birthday":
        if (!value) {
          return "Ngày sinh không được để trống";
        }
        const selectedDate = new Date(value);
        if (isNaN(selectedDate.getTime())) {
          return "Ngày sinh không hợp lệ";
        }
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const hasHadBirthdayThisYear =
          today.getMonth() > selectedDate.getMonth() ||
          (today.getMonth() === selectedDate.getMonth() &&
            today.getDate() >= selectedDate.getDate());
        const finalAge = hasHadBirthdayThisYear ? age : age - 1;
        if (finalAge < 18) {
          return "Bạn phải từ đủ 18 tuổi.";
        }
        return "";

      default:
        return "";
    }
  };

  return (
    <div className="fixed top-12 inset-0 bg-black/50 flex items-center justify-center overflow-y-auto p-4 shadow-none">
      <Card className="w-full max-w-4xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chỉnh Sửa Hồ Sơ</CardTitle>
          <CardDescription>Thay đổi thông tin cá nhân của bạn</CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 px-3 mx-auto gap-4 mb-4">
            <TabsTrigger
              value="personal"
              className="py-3 rounded data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Thông Tin Cá Nhân
            </TabsTrigger>
            <TabsTrigger
              value="additional"
              className="py-3 rounded data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Thông Tin Thêm
            </TabsTrigger>
          </TabsList>

          <form onSubmit={HandleSubmitClick}>
            <TabsContent value="personal">
              <Card className="border-0 space-y-4 pt-4 shadow-none border-none rounded-none">
                <CardContent className="space-y-4 pt-4 shadow-none border-none rounded-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-sm font-medium">
                        Họ và tên
                      </Label>
                      <Input
                        id="fullname"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full"
                        required
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sex" className="text-sm font-medium">
                        Giới tính
                      </Label>
                      <Select
                        value={formData.sex || "other"}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.sex && (
                        <p className="text-sm text-red-500">{errors.sex}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthday" className="text-sm font-medium">
                        Ngày sinh
                      </Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={
                          formData.birthday &&
                          !isNaN(Date.parse(formData.birthday))
                            ? new Date(formData.birthday)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleBirthdayChange}
                        className="w-full"
                      />
                      {errors.birthday && (
                        <p style={{ color: "red" }}>{errors.birthday}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Tiểu sử
                    </Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                    {errors.bio && (
                      <p className="text-sm text-red-500">{errors.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Địa chỉ hiện tại
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Cập nhật địa chỉ
                      </Label>
                      <InputAddressFields
                        oldLocation={formData.address}
                        houseNumber={houseNumber}
                        setHouseNumber={setHouseNumber}
                        setFormData={setFormData}
                        errors={errors}
                      />
                      {addressError && (
                        <p className="text-sm text-red-500 mt-1">
                          {addressError}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <CardFooter className="mt-6 flex justify-end space-x-2">
              <Button
                className="hover:bg-gray-200 rounded"
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
                disabled={isLoading}
              >
                Đổi mật khẩu
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={HandleSubmitClick}
              >
                Lưu thay đổi
              </Button>
            </CardFooter>
          </form>
        </Tabs>
        <PasswordChange
          isOpen={showPasswordDialog}
          setIsOpen={setShowPasswordDialog}
          userId={userId}
          initialData={initialData}
        />
      </Card>
    </div>
  );
};

export default EditProfilePopup;
