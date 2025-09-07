import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaPlus, FaSort } from "react-icons/fa";

interface Category {
  categoryId: string;
  name: string;
  description: string;
}

interface CategoryManagerProps {
  categories: Category[];
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onAdd: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortField, setSortField] = useState<"categoryId" | "name" | "description">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const filterCategories = () => {
      if (!Array.isArray(categories)) {
        console.error("categories is not an array:", categories);
        setFilteredCategories([]);
        return;
      }

      let filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort the filtered results
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortField].toLowerCase();
        const bValue = b[sortField].toLowerCase();
        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });

      setFilteredCategories(filtered);
    };

    filterCategories();
  }, [searchTerm, categories, sortField, sortDirection]);

  const handleSort = (field: "categoryId" | "name" | "description") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field)
      return <FaSort className="w-3 h-3 ms-1.5 text-gray-400" />;
    return (
      <FaSort
        className={`w-3 h-3 ms-1.5 ${
          sortDirection === "asc" ? "text-blue-500" : "text-blue-700"
        }`}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 lg:px-16 xl:px-32">
      {/* Header */}
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="relative flex-grow mx-2 w-full md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả danh mục"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center h-12 px-6 bg-blue-500 text-white text-nowrap shadow-sm font-semibold rounded-xl hover:bg-blue-600 transition duration-200"
          >
            <FaPlus className="mr-2" /> Thêm Danh Mục
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("categoryId")}
                >
                  Mã Danh Mục
                  {getSortIcon("categoryId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("name")}
                >
                  Tên
                  {getSortIcon("name")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("description")}
                >
                  Mô Tả
                  {getSortIcon("description")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <tr
                  key={category.categoryId}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {category.categoryId}
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {category.name}
                  </th>
                  <td className="px-6 py-4">
                    {truncateText(category.description, 100)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(category.categoryId)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Category"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(category.categoryId)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Category"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;
