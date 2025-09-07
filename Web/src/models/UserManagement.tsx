import axios from "axios";

export interface Role {
  roleId: string;
  rolename: string;
  description: string;
}

export interface User {
  userId: string;
  username: string;
  status: number;
  createDate: string;
  gmail: string;
  fullname: string;
  sex: string;
  phone: string;
  address: string;
  avatar: string;
  birthday: string;
  bio: string;
  bank?: string;
  bankType?: string;
  roles: Role[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
const DEFAULT_IMAGE =
  "https://img3.gelbooru.com/images/c6/04/c604a5f863d5ad32cc8afe8affadfee6.jpg";

const convertToUser = async (data: any): Promise<User> => {
  return {
    userId: data?.userId ?? "",
    username: data?.username ?? "",
    status: data?.status ?? 0,
    createDate: data?.createDate ?? "",
    gmail: data?.gmail ?? "",
    fullname: data?.fullname ?? "",
    sex: data?.sex ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
    avatar: data.avatar,
    birthday: data?.birthday ?? "",
    bio: data?.bio ?? "",
    roles:
      data?.roles?.map((role: any) => ({
        roleId: role?.roleId ?? "",
        rolename: role?.rolename ?? "",
        description: role?.description ?? "",
      })) ?? [],
    bank: data?.bank ?? "",
    bankType: data?.bankType ?? "",
  };
};

export const UserService = {
  async fetchUsers(): Promise<User[]> {
    try {
      const response = await axios.get<ApiResponse<any[]>>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/User/read`
      );
      console.log("response", response);
      console.log("data:", response.data);
      const users = await Promise.all(response.data.data.map(convertToUser));
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};
