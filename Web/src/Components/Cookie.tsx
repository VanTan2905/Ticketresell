// utils/auth.js
import Cookies from 'js-cookie';

export const checkAccessKey = async () => {
  // Lấy giá trị cookie bằng js-cookie
  const id = Cookies.get('id');
  const accessKey = Cookies.get('accessKey');
  console.log("checkaccesskey activated");
  
  // Kiểm tra xem cookie có tồn tại không
  if (!id || !accessKey) {
    console.log("cookies is empty");
    return false; // Cookie không tồn tại hoặc không hợp lệ
  }

  try {
    // Gọi API để kiểm tra accessKey
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/login-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId : id,
        accessKey : accessKey,
      }),
    });

    const result = await response.json();
    console.log(result);
    

    if (result){
      return true;
    }
     // Trả về true nếu accessKey hợp lệ
  } catch (error) {
    console.error('Lỗi khi kiểm tra accessKey:', error);
    return false;
  }
};

export const removeCookie = (cookieName: string) => {
  Cookies.remove(cookieName);
  console.log(`Cookie ${cookieName} has been removed`);
};

// Hàm xóa tất cả cookie
export const removeAllCookies = () => {
  const allCookies = Cookies.get(); // Lấy tất cả các cookie

  // Lặp qua và xóa từng cookie
  for (const cookieName in allCookies) {
    Cookies.remove(cookieName);
  }

  console.log("All cookies have been removed");
};
