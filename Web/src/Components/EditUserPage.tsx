import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Role } from "@/models/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import InputAddressFields from "@/Hooks/locationInputTemplate";

interface FormData {
  userId: string;
  username?: string;
  gmail?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  status: number;
  fullname?: string;
  sex?: string;
  createDate: string;
  sellConfigId?: string;
  bio?: string;
  birthday?: string;
  bank: string;
  bankType: string;
}

// Define types for props
interface EditUserDialogProps {
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  user: FormData | null;
  onSave: (data: any) => void;
}

interface Errors {
  [key: string]: string; // Định nghĩa rằng key có thể là bất kỳ chuỗi nào và value là một chuỗi
}
// Edit User Dialog
const EditUserDialog: React.FC<EditUserDialogProps> = ({
  roles,
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [formDataLocation, setFormDataLocation] = useState<any>({
    location: user?.address || "",
  });
  const [formData, setFormData] = useState<FormData>({
    userId: user?.userId || "",
    username: user?.username || "",
    gmail: user?.gmail || "",
    avatar: user?.avatar || "",
    phone: user?.phone || "",
    address: user?.address || "",
    status: user?.status || 0,
    fullname: user?.fullname || "",
    sex: user?.sex || "",
    createDate: user?.createDate || "",
    sellConfigId: user?.sellConfigId || "",
    bio: user?.bio || "",
    birthday: user?.birthday || "",
    bank: user?.bank || "",
    bankType: user?.bankType || "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const handleBirthdayChange = (e: any) => {
    const { value } = e.target;

    // Update the form data
    setFormData((prevData) => ({
      ...prevData,
      birthday: value,
    }));

    // Validate the birthday
    validateBirthday(value);
  };

  // Validation function
  const validateBirthday = (birthday: any) => {
    const selectedDate = new Date(birthday);
    const today = new Date();

    const age = today.getFullYear() - selectedDate.getFullYear();

    // Check if birthday has already happened this year
    const hasHadBirthdayThisYear =
      today.getMonth() > selectedDate.getMonth() ||
      (today.getMonth() === selectedDate.getMonth() &&
        today.getDate() >= selectedDate.getDate());

    const finalAge = hasHadBirthdayThisYear ? age : age - 1;

    if (finalAge < 18) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "Bạn phải đủ 18 tuổi trở lên.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        birthday: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user?.userId; // Replace with actual userId

    const updateData = {
      username: formData.username,
      gmail: formData.gmail, // Adjust the mapping if the API expects "gmail" instead of "email"
      phone: formData.phone,
      fullname: formData.fullname,
      sex: formData.sex,
      address: formData.address,
      birthday: formData.birthday
        ? new Date(formData.birthday).toISOString()
        : null,
      bio: formData.bio,
      bank: hasR02Role ? formData.bank : null, // Only send bank if role R02 exists
      bankType: hasR02Role ? formData.bankType : null, // Only send bankType if role R02 exists
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/User/updateadmin/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      const result = await response.json();
      console.log("Update successful", result);
      onSave(result.data);
      // Handle successful update (e.g., show success message or redirect)
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error (e.g., show error message)
    }
    onClose();
  };
  const hasR02Role = roles.some((r) => r.roleId === "RO2");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center overflow-y-auto p-4">
      <Card className="w-full max-w-4xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chỉnh Sửa Hồ Sơ</CardTitle>
          <CardDescription>Thay đổi thông tin hồ sơ của bạn</CardDescription>
        </CardHeader>

        <Tabs defaultValue="personal" className="w-full p-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Thông Tin Cá Nhân</TabsTrigger>
            <TabsTrigger value="additional">Thông Tin Bổ Sung</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="personal">
              <Card className="space-y-4 pt-4 shadow-none border-none rounded-none">
                <CardContent className="space-y-4 pt-4 shadow-none border-none rounded-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Tên đăng nhập
                      </Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gmail" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="gmail"
                        type="email"
                        value={formData.gmail}
                        onChange={(e) =>
                          setFormData({ ...formData, gmail: e.target.value })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-sm font-medium">
                        Họ và tên
                      </Label>
                      <Input
                        id="fullname"
                        value={formData.fullname}
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sex" className="text-sm font-medium">
                        Giới tính
                      </Label>
                      <Select
                        value={formData.sex}
                        onValueChange={(value) =>
                          setFormData({ ...formData, sex: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthday" className="text-sm font-medium">
                        Ngày sinh
                      </Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={
                          formData.birthday
                            ? new Date(formData.birthday)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleBirthdayChange}
                        className="w-full"
                      />
                      {errors.birthday && (
                        <p style={{ color: "red" }}>
                          Bạn phải đủ 18 tuổi trở lên.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    {hasR02Role && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank" className="text-sm font-medium">
                            Ngân hàng
                          </Label>
                          <Input
                            id="bank"
                            value={formData.bank}
                            onChange={(e) =>
                              setFormData({ ...formData, bank: e.target.value })
                            }
                            className="w-full"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="bankType"
                            className="text-sm font-medium"
                          >
                            Loại tài khoản
                          </Label>
                          <Input
                            id="bankType"
                            value={formData.bankType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                bankType: e.target.value,
                              })
                            }
                            className="w-full"
                            required
                          />
                        </div>
                      </div>
                    )}

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
                        houseNumber={houseNumber}
                        setHouseNumber={setHouseNumber}
                        setFormData={setFormData}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Tiểu sử
                      </Label>
                      <Input
                        id="bio"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <CardFooter className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Lưu thay đổi
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

// Define types for Account Status Dialog props
interface RoleStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Account Status Dialog
const RoleStatusDialog: React.FC<RoleStatusDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Vô hiệu hóa người bán</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn vô hiệu hóa vai trò này? Người dùng sẽ không
            thể truy cập vào hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Vô hiệu hóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Define types for Account Status Dialog props
interface AccountStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onConfirm: () => void;
}

// Account Status Dialog
const AccountStatusDialog: React.FC<AccountStatusDialogProps> = ({
  isOpen,
  onClose,
  isActive,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive
              ? "Bạn có chắc chắn muốn vô hiệu hóa tài khoản này? Người dùng sẽ không thể truy cập vào hệ thống."
              : "Bạn có chắc chắn muốn kích hoạt tài khoản này? Người dùng sẽ có thể truy cập lại hệ thống."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              isActive
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {isActive ? "Vô hiệu hóa" : "Kích hoạt"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Define types for Reset Password Dialog props
interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Reset Password Dialog
const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đặt lại mật khẩu</AlertDialogTitle>
          <AlertDialogDescription>
            Hệ thống sẽ tạo một mật khẩu ngẫu nhiên mới cho người dùng. Người
            dùng sẽ cần thay đổi mật khẩu khi đăng nhập lần sau.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Đặt lại mật khẩu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export {
  EditUserDialog,
  RoleStatusDialog,
  AccountStatusDialog,
  ResetPasswordDialog,
};
