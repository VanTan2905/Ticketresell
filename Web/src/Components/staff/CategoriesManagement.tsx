"use client";
import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

interface Category {
  categoryId: string;
  name?: string; // Làm cho tên không bắt buộc
  description?: string; // Làm cho mô tả không bắt buộc
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const [errors, setErrors] = useState({
    categoryId: '',
    name: '',
    description: ''
  });

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/read`
        );
        const result = await response.json();
        if (result.statusCode === 200) {
          setCategories(result.data);
        } else {
          console.error("Lấy danh mục không thành công:", result.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const generateUniqueCategoryId = (existingIds: string[]) => {
    const prefix = "CAT";
    let newIdNumber = 1; // Bắt đầu từ 1
    let newId;

    // Tìm ID duy nhất
    while (true) {
      newId = `${prefix}${newIdNumber.toString().padStart(3, "0")}`;
      if (!existingIds.includes(newId)) {
        break; // Tìm thấy ID duy nhất
      }
      newIdNumber++;
    }

    return newId;
  };

  const validateCategoryId = (id: string) => {
    const regex = /^CAT\d{3}$/;
    return regex.test(id);
  };

  const validateName = (name: string) => {
    const regex = /^[^0-9]{5,90}$/;
    return regex.test(name);
  };

  const validateDescription = (description: string) => {
    return  description.length <= 200;
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentCategory(null);
    setFormData({});
    setErrors({
      categoryId: '',
      name: '',
      description: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentCategory) {
      // Chỉnh sửa danh mục
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/update/${currentCategory.categoryId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              description: formData.description,
            }),
          }
        );

        const result = await response.json();
        if (result.statusCode === 200) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.categoryId === currentCategory.categoryId
                ? { ...category, ...formData }
                : category
            )
          );
        } else {
          console.error("Cập nhật danh mục không thành công:", result.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
      }
    } else {
      // Thêm danh mục mới
      try {
        const existingIds = categories.map((cat) => cat.categoryId); // Lấy ID danh mục hiện có
        const newCategoryId = generateUniqueCategoryId(existingIds); // Tạo ID duy nhất

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/create`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              categoryId: newCategoryId,
              name: formData.name,
              description: formData.description,
            }),
          }
        );

        const result = await response.json();
        if (result.statusCode === 200) {
          setCategories([
            ...categories,
            { categoryId: newCategoryId, ...formData },
          ]);
        } else {
          console.error("Tạo danh mục không thành công:", result.message);
        }
      } catch (error) {
        console.error("Lỗi khi tạo danh mục:", error);
      }
    }

    handleCloseModal();
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Category/delete/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.statusCode === 200) {
        setCategories(
          categories.filter((category) => category.categoryId !== categoryId)
        );
      } else {
        console.error("Xóa danh mục không thành công:", result.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData(category);
    setIsOpen(true);
  };

  const filteredCategories = categories.filter(
    (category) =>
      (category.name &&
        category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lí danh mục</CardTitle>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 bottom-2 transform h-5 w-5 text-gray-500" />
            <Input
              placeholder="Tìm danh mục..."
              className="px-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setCurrentCategory(null);
              setFormData({});
              setIsOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6 shadow-md"
          >
            <PlusCircle className="mr-2 h-6 w-6" />
            Thêm danh mục
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className=" border rounded-xl overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Danh mục</th>
                <th className="py-3 px-4 text-left">Mô tả</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{category.categoryId}</td>
                  <td className="py-3 px-4">{category.name}</td>
                  <td className="py-3 px-4">{category.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {/* Edit Icon */}
                      <div
                        onClick={() => handleEdit(category)}
                        className="cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600"
                          viewBox="0 0 512 512"
                          fill="currentColor"
                        >
                          <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                        </svg>
                      </div>

                      {/* Delete Icon */}
                      <div
                        onClick={() => handleDelete(category.categoryId)}
                        className="cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                        >
                          <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <button
                onClick={handleCloseModal}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Hủy
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                type="submit"
                form="categoryForm"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                {currentCategory ? "Cập nhật" : "Thêm"}
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4 rounded-md">
                <div className="space-y-2">
                  <input
                    type="text"
                    name="categoryId"
                    placeholder="Mã danh mục (VD: CAT001)"
                    defaultValue={currentCategory?.categoryId || ""}
                    onChange={(e) => {
                      const isValid = validateCategoryId(e.target.value);
                      setErrors(prev => ({
                        ...prev,
                        categoryId: isValid ? '' : 'ID phải có dạng CAT và 3 số (VD: CAT001)'
                      }));
                    }}
                    className={`w-full border ${errors.categoryId ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200`}
                  />
                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      const isValid = validateName(e.target.value);
                      setErrors(prev => ({
                        ...prev,
                        name: isValid ? '' : 'Tên phải từ 5-90 ký tự và không được chứa số'
                      }));
                    }}
                    placeholder="Tên danh mục"
                    className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200`}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.description || ""}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      const isValid = validateDescription(e.target.value);
                      setErrors(prev => ({
                        ...prev,
                        description: isValid ? '' : 'Mô tả phải dưới 200 ký tự'
                      }));
                    }}
                    placeholder="Mô tả"
                    className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-xl shadow-sm py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200`}
                    required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CategoryManagement;
