"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchTickets } from "@/models/TicketFetch";
import { UserService, User, Role } from "@/models/UserManagement";
import {
  Person as UsersIcon,
  Group as RolesIcon,
  TravelExplore as TicketsIcon,
  Category as CategoriesIcon,
  ShoppingCart as OrdersIcon,
  ShoppingBasket,
} from "@mui/icons-material";
import UserManager from "./UserManager";
import RoleManager from "./RoleManager";
import TicketManager from "./TicketManager";
import CategoryManager from "./CategoryManager";
import OrderManager from "./OrderManager";
import RevenueManager from "./RevenueManager";
import {
  AccountStatusDialog,
  EditUserDialog,
  RoleStatusDialog,
} from "./EditUserPage";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { removeAllCookies } from "./Cookie";
import { logoutUser } from "./Logout";
import OrderDetailsDashboard from "./BuyerSellDashboard";
import { motion, AnimatePresence } from "framer-motion";

const AdminPage = () => {
  const [id, setId] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [topBuyers, setTopBuyers] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Người dùng");
  const router = useRouter();
  const searchParams = useSearchParams();
  const sidebarTabs = [
    { name: "Người dùng", icon: <UsersIcon /> },
    { name: "Vai trò", icon: <RolesIcon /> },
    { name: "Vé", icon: <TicketsIcon /> },
    { name: "Danh mục", icon: <CategoriesIcon /> },
    { name: "Đơn hàng", icon: <OrdersIcon /> },
    { name: "Doanh thu", icon: <ShoppingBasket /> },
  ];

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [isRoleDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isCategoryDeleteConfirmOpen, setIsCategoryDeleteConfirmOpen] =
    useState(false);

  useEffect(() => {
    setId(Cookies.get("id") || "Not found");
  }, []);

  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const validTab = sidebarTabs.find((tab) => tab.name === page);
      if (page && validTab) {
        setActiveTab(page);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const getTickets = async () => {
      const fetchedTickets = await fetchTickets();
      setTickets(fetchedTickets);
    };
    const getUsers = async () => {
      try {
        const fetchedUsers = await UserService.fetchUsers();
        console.log("fetchUser", fetchedUsers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    const getRoles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Role/read`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const data = await response.json();
        setRoles(data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const getCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/read`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const getOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Order/read`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("orders", data);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        setOrders(data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const getRevenues = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Revenue/readAllRevenues`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("revenueData", data);
        if (!response.ok) {
          throw new Error("Failed to fetch Revenues");
        }
        setRevenues(data.data);
      } catch (error) {
        setRevenues([]);
        console.error("Error fetching Revenues:", error);
      }
    };
    const getTopBuyers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/User/allBuyer`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("topbuyer:", result.data);
        setTopBuyers(result.data);
      } catch (error) {
        setTopBuyers([]);
      }
    };
    const getTransactions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Transaction/allBuyers`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("transactionData", data);
        if (!response.ok) {
          throw new Error("Failed to fetch Revenues");
        }
        setTransactions(data.data);
      } catch (error) {
        setTransactions([]);
        console.error("Error fetching Revenues:", error);
      }
    };
    getTopBuyers();
    getTransactions();
    getUsers();
    getTickets();
    getRoles();
    getCategories();
    getOrders();
    getRevenues();
    console.log("alo alo", users);
  }, []);
  useEffect(() => {
    console.log("User updated", users);
  }, [users]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleTicketActive = async (ticketId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/active/${ticketId}`;

    try {
      const response = await fetch(url, {
        method: "GET", // or PATCH based on your API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Ticket status update response:", result);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticketId === ticketId ? { ...ticket, status: 1 } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const handleTicketDelete = async (ticketId: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/ticket/disable/${ticketId}`;

    try {
      const response = await fetch(url, {
        method: "GET", // or PATCH based on your API
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Ticket status update response:", result);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticketId === ticketId ? { ...ticket, status: 0 } : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isEditRoleOpen, setEditRoleOpen] = useState(false);
  const [isEditStatusOpen, setEditStatusOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null); // To store the selected user details
  const [isActive, setActive] = useState<boolean>(false);

  const handleUserOnEdit = async (userId: string) => {
    const userToEdit = users.find((user) => user.userId === userId); // Find the user by ID (assuming 'users' is an array of user objects)
    console.log(userToEdit);
    if (userToEdit) {
      setSelectedUser(userToEdit); // Set the selected user
      setEditDialogOpen(true); // Open the edit dialog
    }
  };
  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };
  const handleUserOnDisableAccount = async (userId: string) => {
    const userToEdit = users.find((user) => user.userId === userId); // Find the user by ID (assuming 'users' is an array of user objects)
    console.log(userToEdit);
    if (userToEdit) {
      setActive(true);
      setSelectedUser(userToEdit); // Set the selected user
      setEditStatusOpen(true); // Open the edit dialog
    }
  };
  const handleUserOnEnableAccount = async (userId: string) => {
    const userToEdit = users.find((user) => user.userId === userId); // Find the user by ID (assuming 'users' is an array of user objects)
    console.log(userToEdit);
    if (userToEdit) {
      setActive(false);
      setSelectedUser(userToEdit); // Set the selected user
      setEditStatusOpen(true); // Open the edit dialog
    }
  };

  const handleEditUserRoles = async (userId: string, updatedRoles: Role[]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/User/updaterole/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedRoles),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user roles.");
      }

      const result = await response.json();
      console.log("User roles updated successfully:", result);

      // Update the local users state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, roles: updatedRoles } : user
        )
      );

      // Optionally, you can show a success message to the admin
      alert("User roles updated successfully.");
    } catch (error) {
      console.error("Error updating user roles:", error);
      alert(`Error updating user roles: ${error}`);
    }
  };
  const handleConfirmStatus = async () => {
    try {
      // Make the API call here
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/User/updatestatus/${selectedUser?.userId}`,
        {
          method: "PUT", // Use DELETE method
          headers: {
            "Content-Type": "application/json",
            // Include any other headers your API requires
          },
        }
      );
      // Optionally: refresh user data or update local state
      console.log(`User ${selectedUser?.userId} status updated successfully.`);
      setUsers((users) =>
        users.map((user) =>
          user.userId === selectedUser.userId
            ? {
              ...user,
              status: user.status === 0 ? 1 : 0, // Toggle status
            }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setEditStatusOpen(false); // Close the dialog after confirming
    }
  };
  const handleCloseStatusDialog = () => {
    setEditStatusOpen(false);
    setSelectedUser(null);
  };
  const handleUserOnEditRoles = async (userId: string) => {
    const userToEdit = users.find((user) => user.userId === userId); // Find the user by ID (assuming 'users' is an array of user objects)
    console.log(userToEdit);
    if (userToEdit) {
      setSelectedUser(userToEdit); // Set the selected user
      setEditRoleOpen(true); // Open the edit dialog
    }
  };
  const handleCloseRoleDialog = () => {
    setEditRoleOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDisableRole = async () => {
    if (selectedUser?.userId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/User/deleteseller/${selectedUser?.userId}`,
          {
            method: "DELETE", // Use DELETE method
            headers: {
              "Content-Type": "application/json",
              // Include any other headers your API requires
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`Disabled seller with ID: ${selectedUser.userId}`, result);
        setUsers((users) =>
          users.map((user) =>
            user.userId === selectedUser.userId
              ? {
                ...user,
                roles: user.roles.filter((role) => role.roleId !== "RO2"),
              }
              : user
          )
        );
        // Additional logic after a successful API call...
      } catch (error) {
        console.error("Failed to disable seller:", error);
      }
    }
    setEditRoleOpen(false); // Close the dialog after the operation
    setSelectedUser(null); // Clear the selected user ID
  };
  const handleUserOnResetPassword = async (userId: string) => { };

  const handleRoleAdd = async () => {
    setCurrentRole(null);
    setIsRoleModalOpen(true);
  };

  const handleRoleEdit = async (roleId: string) => {
    const roleToEdit = roles.find((role) => role.roleId === roleId);
    setCurrentRole(roleToEdit);
    setIsRoleModalOpen(true);
  };

  const handleRoleDelete = async (roleId: string) => {
    setCurrentRole(roles.find((role) => role.roleId === roleId));
    setIsDeleteConfirmOpen(true);
  };

  const validateRole = (roleData: any) => {
    const errors = [];
    
    // Required field validations
    if (!roleData.roleId?.trim()) {
      errors.push("Mã vai trò không được để trống");
    } else {
      // RoleId format validation
      if (!roleData.roleId.startsWith("RO")) {
        errors.push("Mã vai trò phải bắt đầu bằng 'RO'");
      }
      if (roleData.roleId.length > 10) {
        errors.push("Mã vai trò không được quá 10 ký tự");
      }
    }
    
    if (!roleData.rolename?.trim()) {
      errors.push("Tên vai trò không được để trống");
    }

    return errors;
  };

  const handleRoleSubmit = async (roleData: any) => {
    try {
      const validationErrors = validateRole(roleData);
      if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        return;
      }

      let response;
      if (currentRole) {
        // Edit existing role
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Role/update/${roleData.roleId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roleData),
            credentials: "include",
          }
        );
      } else {
        // Check if roleId already exists
        const existingRole = roles.find(r => r.roleId === roleData.roleId);
        if (existingRole) {
          alert("Mã vai trò đã tồn tại");
          return;
        }

        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Role/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(roleData),
            credentials: "include",
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to submit role");
      }

      const result = await response.json();
      console.log(result.message);

      // Update the roles state
      if (currentRole) {
        setRoles(roles.map((role) =>
          role.roleId === roleData.roleId ? result.data : role
        ));
      } else {
        setRoles([...roles, result.data]);
      }

      setIsRoleModalOpen(false);
    } catch (error) {
      console.error("Error submitting role:", error);
      alert("Có lỗi xảy ra khi lưu vai trò");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (currentRole) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Role/delete/${currentRole.roleId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete role");
        }

        const result = await response.json();
        console.log(result.message);

        // Remove the deleted role from the state
        setRoles(roles.filter((role) => role.roleId !== currentRole.roleId));

        setIsDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };
  function convertFormDataToUser(formData: any): User {
    return {
      userId: formData.userId,
      username: formData.username || "", // Provide default value if undefined
      status: formData.status,
      createDate: formData.createDate,
      gmail: formData.gmail || "", // Mapping 'email' in FormData to 'gmail' in User
      fullname: formData.fullname || "",
      sex: formData.sex || "",
      phone: formData.phone || "",
      address: formData.address || "",
      avatar: formData.avatar || "", // Handling undefined with default empty string
      birthday: formData.birthday || "",
      bio: formData.bio || "",
      bank: formData.bank || "", // Optional fields in User
      bankType: formData.bankType || "",
      roles: [], // Assuming roles need to be fetched or added separately
    };
  }

  const handleCategoryAdd = async () => {
    setCurrentCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryEdit = async (categoryId: string) => {
    const categoryToEdit = categories.find(
      (category) => category.categoryId === categoryId
    );
    setCurrentCategory(categoryToEdit);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryDelete = async (categoryId: string) => {
    setCurrentCategory(
      categories.find((category) => category.categoryId === categoryId)
    );
    setIsCategoryDeleteConfirmOpen(true);
  };

  const validateCategory = (categoryData: any) => {
    const errors = [];
    
    // Required field validations
    if (!categoryData.categoryId?.trim()) {
      errors.push("Mã danh mục không được để trống");
    } else {
      // CategoryId format validation
      if (!categoryData.categoryId.startsWith("CAT")) {
        errors.push("Mã danh mục phải bắt đầu bằng 'CAT'");
      }
      if (categoryData.categoryId.length > 10) {
        errors.push("Mã danh mục không được quá 10 ký tự");
      }
    }
    
    if (!categoryData.name?.trim()) {
      errors.push("Tên danh mục không được để trống");
    }

    return errors;
  };

  const handleCategorySubmit = async (categoryData: any) => {
    try {
      const validationErrors = validateCategory(categoryData);
      if (validationErrors.length > 0) {
        alert(validationErrors.join('\n'));
        return;
      }

      let response;
      if (currentCategory) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/update/${categoryData.categoryId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
            credentials: "include",
          }
        );
      } else {
        // Check if categoryId already exists
        const existingCategory = categories.find(c => c.categoryId === categoryData.categoryId);
        if (existingCategory) {
          alert("Mã danh mục đã tồn tại");
          return;
        }

        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoryData),
            credentials: "include",
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to submit category");
      }

      const result = await response.json();
      console.log(result.message);

      // Update the categories state
      if (currentCategory) {
        setCategories(categories.map((category) =>
          category.categoryId === categoryData.categoryId ? { ...category, ...categoryData } : category
        ));
      } else {
        setCategories([...categories, categoryData]);
      }

      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      alert("Có lỗi xảy ra khi lưu danh mục");
    }
  };

  const handleConfirmCategoryDelete = async () => {
    try {
      if (currentCategory) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/delete/${currentCategory.categoryId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        const result = await response.json();
        console.log(result.message);

        // Remove the deleted category from the state
        setCategories(
          categories.filter(
            (category) => category.categoryId !== currentCategory.categoryId
          )
        );

        setIsCategoryDeleteConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleOrderRefresh = async (orderID: string) => { };

  const handleNavigation = (tabName: string) => {
    router.push(`/admin?page=${tabName}`, undefined);
    setActiveTab(tabName);
  };

  const revenuesWithPercentage = revenues.map((item) => ({
    ...item,
    revenue1: item.revenue1 * 0.05,
  }));

  const renderContent = () => {
    switch (activeTab) {
      case "Vé":
        return (
          <TicketManager
            tickets={tickets}
            onActive={handleTicketActive}
            onDelete={handleTicketDelete}
          />
        );
      case "Người dùng":
        return (
          <UserManager
            users={users}
            onEdit={handleUserOnEdit}
            onDisableAccount={handleUserOnDisableAccount}
            onEnableAccount={handleUserOnEnableAccount}
            onDisableSeller={handleUserOnEditRoles}
            onResetPassword={handleUserOnResetPassword}
            onEditRoles={handleEditUserRoles} // Add this line
          />
        );
      case "Vai trò":
        return (
          <RoleManager
            roles={roles}
            onEdit={handleRoleEdit}
            onDelete={handleRoleDelete}
            onAdd={handleRoleAdd}
          />
        );
      case "Danh mục":
        return (
          <CategoryManager
            categories={categories}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            onAdd={handleCategoryAdd}
          />
        );
      case "Đơn hàng":
        return <OrderManager orders={orders} onRefresh={handleOrderRefresh} />;
      case "Doanh thu":
        return (
          <>
            <RevenueManager
              transactions={transactions}
              revenueData={revenuesWithPercentage}
            />
            <OrderDetailsDashboard
              topBuyers={topBuyers}
              revenue={revenuesWithPercentage}
              transactions={transactions}
            />
          </>
        );
      default:
        return (
          <UserManager
            users={users}
            onEdit={handleUserOnEdit}
            onDisableAccount={handleUserOnDisableAccount}
            onEnableAccount={handleUserOnEnableAccount}
            onDisableSeller={handleUserOnEditRoles}
            onResetPassword={handleUserOnResetPassword}
          />
        );
    }
  };

  const handleLogout = async () => {
    if (Cookies.get("id")) {
      await logoutUser(Cookies.get("id"));
    }

    await signOut();
    removeAllCookies();
    window.location.href = "/login";
  };

  // Add these animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { 
      y: "100%", 
      opacity: 0,
      transition: { 
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Mở thanh bên</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <div className="z-50 relative">
        <AnimatePresence>
          {isEditDialogOpen && selectedUser && (
            <EditUserDialog
              roles={selectedUser.roles}
              isOpen={isEditDialogOpen}
              onClose={handleCloseDialog}
              user={selectedUser}
              onSave={(updatedData) => {
                setUsers((users) =>
                  users.map((user) =>
                    user.userId === updatedData.userId ? updatedData : user
                  )
                );
                console.log("Updated User Data:", updatedData);
                handleCloseDialog();
              }}
            />
          )}

          {isEditRoleOpen && selectedUser && (
            <RoleStatusDialog
              isOpen={isEditRoleOpen}
              onClose={handleCloseRoleDialog}
              onConfirm={handleConfirmDisableRole}
            />
          )}

          {isEditStatusOpen && selectedUser && (
            <AccountStatusDialog
              isOpen={isEditStatusOpen}
              onClose={handleCloseStatusDialog}
              isActive={isActive}
              onConfirm={handleConfirmStatus}
            />
          )}

          {isRoleModalOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-end justify-center sm:items-center p-4"
            >
              <motion.div
                variants={modalVariants}
                className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md"
              >
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setIsRoleModalOpen(false)}
                    className="text-blue-500 font-semibold"
                  >
                    Hủy
                  </button>
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
                  </h3>
                  <button
                    type="submit"
                    form="roleForm"
                    className="text-blue-500 font-semibold"
                  >
                    {currentRole ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <form
                    id="roleForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const roleData = {
                        roleId: formData.get("roleId"),
                        rolename: formData.get("rolename"),
                        description: formData.get("description"),
                      };
                      handleRoleSubmit(roleData);
                    }}
                  >
                    <input
                      type="text"
                      name="roleId"
                      placeholder="Mã vai trò"
                      defaultValue={currentRole?.roleId || ""}
                      readOnly={!!currentRole}
                      className={`w-full border rounded-md shadow-sm py-2 px-3 mb-2 ${
                        currentRole ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <input
                      type="text"
                      name="rolename"
                      placeholder="Tên vai trò"
                      defaultValue={currentRole?.rolename || ""}
                      className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Mô tả"
                      defaultValue={currentRole?.description || ""}
                      className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                    />
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isRoleDeleteConfirmOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-end justify-center sm:items-center p-4"
            >
              <motion.div
                variants={modalVariants}
                className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md"
              >
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="text-blue-500 font-semibold"
                  >
                    Hủy
                  </button>
                  <h3 className="text-lg font-medium text-gray-900">
                    Xác nhận xóa
                  </h3>
                  <button
                    onClick={handleConfirmDelete}
                    className="text-red-500 font-semibold"
                  >
                    Xóa
                  </button>
                </div>
                <div className="p-4">
                  <p>Bạn có chắc chắn muốn xóa vai trò này?</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isCategoryModalOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-end justify-center sm:items-center p-4"
            >
              <motion.div
                variants={modalVariants}
                className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md"
              >
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="text-blue-500 font-semibold"
                  >
                    Hủy
                  </button>
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                  </h3>
                  <button
                    type="submit"
                    form="categoryForm"
                    className="text-blue-500 font-semibold"
                  >
                    {currentCategory ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <form
                    id="categoryForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const categoryData = {
                        categoryId: formData.get("categoryId"),
                        name: formData.get("name"),
                        description: formData.get("description"),
                      };
                      handleCategorySubmit(categoryData);
                    }}
                  >
                    <input
                      type="text"
                      name="categoryId"
                      placeholder="Mã danh mục"
                      defaultValue={currentCategory?.categoryId || ""}
                      readOnly={!!currentCategory}
                      className={`w-full border rounded-md shadow-sm py-2 px-3 mb-2 ${
                        currentCategory ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Tên danh mục"
                      defaultValue={currentCategory?.name || ""}
                      className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Mô tả"
                      defaultValue={currentCategory?.description || ""}
                      className="w-full border rounded-md shadow-sm py-2 px-3 mb-2"
                    />
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isCategoryDeleteConfirmOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/50 bg-opacity-20 flex items-end justify-center sm:items-center p-4"
            >
              <motion.div
                variants={modalVariants}
                className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md"
              >
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setIsCategoryDeleteConfirmOpen(false)}
                    className="text-blue-500 font-semibold"
                  >
                    Hủy
                  </button>
                  <h3 className="text-lg font-medium text-gray-900">
                    Xác nhận xóa
                  </h3>
                  <button
                    onClick={handleConfirmCategoryDelete}
                    className="text-red-500 font-semibold"
                  >
                    Xóa
                  </button>
                </div>
                <div className="p-4">
                  <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-border">
              <span className="text-emerald-500 text-2xl font-bold">
                Ticket{" "}
              </span>
              <span className="resell text-black/50 text-2xl font-bold">
                Resell{" "}
              </span>
              Admin
            </h2>
            <button
              onClick={closeSidebar}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white sm:hidden"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Main navigation */}
          <ul className="space-y-2 font-medium flex-grow">
            {sidebarTabs.map((tab, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(tab.name)}
                  className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left ${activeTab === tab.name ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                >
                  <span className="flex items-center justify-center w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                    {tab.icon}
                  </span>
                  <span className="ms-3">{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout button at the bottom */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* User ID display */}
            <div className="flex items-center p-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="ms-3 font-medium text-sm overflow-hidden max-w-64 text-nowrap">
                ID: {id}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 dark:text-red-400 dark:hover:bg-gray-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="ms-3 font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
        {renderContent()}
      </div>


    </>
  );
};

export default AdminPage;
