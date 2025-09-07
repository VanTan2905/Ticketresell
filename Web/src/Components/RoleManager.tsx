import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch, FaPlus, FaSort } from "react-icons/fa";
import { Role } from "@/models/UserManagement";

interface RoleListProps {
  roles: Role[];
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  onAdd: () => void;
}

const RoleManager: React.FC<RoleListProps> = ({
  roles,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [sortField, setSortField] = useState<"roleId" | "rolename" | "description">(
    "rolename"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const filterRoles = () => {
      if (!Array.isArray(roles)) {
        console.error("roles is not an array:", roles);
        setFilteredRoles([]);
        return;
      }

      let filtered = roles.filter(
        (role) =>
          role.rolename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase())
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

      setFilteredRoles(filtered);
    };

    filterRoles();
  }, [searchTerm, roles, sortField, sortDirection]);

  const handleSort = (field: "roleId" | "rolename" | "description") => {
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="relative flex-grow mx-2 w-full md:mb-0">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên vai trò hoặc mô tả"
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
            <FaPlus className="mr-2" /> Thêm Vai Trò
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
                  onClick={() => handleSort("roleId")}
                >
                  Mã Vai Trò
                  {getSortIcon("roleId")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div
                  className="flex items-center cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("rolename")}
                >
                  Tên Vai Trò
                  {getSortIcon("rolename")}
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
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr
                  key={role.roleId}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {role.roleId}
                  </td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {role.rolename}
                  </th>
                  <td className="px-6 py-4">
                    {truncateText(role.description, 100)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(role.roleId)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Sửa Vai Trò"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDelete(role.roleId)}
                        className="text-red-500 hover:text-red-700"
                        title="Xóa Vai Trò"
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
                  Không tìm thấy vai trò nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleManager;
