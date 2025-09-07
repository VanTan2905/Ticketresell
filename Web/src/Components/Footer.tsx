import React from "react";
import "@/Css/Footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-subscribe">
        <h3>Đón Nhận Thông Tin Mới Nhất</h3>
        <p>
            Tham gia danh sách nhận thư của chúng tôi để không bỏ lỡ những thông tin mới nhất về vé, 
            cập nhật, cũng như các mẹo mua bán vé an toàn trên TicketResell.
          </p>
          <form className="subscribe-form">
            <input type="email" placeholder="Địa chỉ email của bạn" />
            <button type="submit">Đăng ký</button>
          </form>
        </div>
        <div className="footer-community">
          <h3>Tham Gia Cộng Đồng</h3>
          <div className="social-icons">
            {/* Thêm biểu tượng mạng xã hội với các liên kết tương ứng */}
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-discord"></i>
            </a>
            <a href="#">
              <i className="fab fa-github"></i>
            </a>
            <a href="#">
              <i className="fab fa-reddit"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="footer-help">
          <h3>Cần Hỗ Trợ?</h3>
          <a href="#" className="contact-support-button">
            Liên Hệ Hỗ Trợ
          </a>
        </div>
      </div>

      <div className="footer-middle">
        <div className="footer-section">
          <h4>TicketResell</h4>
          <p>
            Nền tảng đáng tin cậy của bạn để mua, bán và khám phá vé cho những sự kiện độc quyền. 
            Giao dịch vé an toàn và dễ dàng.
          </p>
        </div>
        <div className="footer-section">
          <h4>Danh Mục</h4>
          <ul>
            <li>
              <a href="#">Hòa Nhạc</a>
            </li>
            <li>
              <a href="#">Thể Thao</a>
            </li>
            <li>
              <a href="#">Nhà Hát</a>
            </li>
            <li>
              <a href="#">Lễ Hội</a>
            </li>
            <li>
              <a href="#">Triển Lãm</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Tài Khoản Của Tôi</h4>
          <ul>
            <li>
              <a href="#">Hồ Sơ</a>
            </li>
            <li>
              <a href="#">Yêu Thích</a>
            </li>
            <li>
              <a href="#">Lịch Sử Mua Hàng</a>
            </li>
            <li>
              <a href="#">Giỏ Hàng</a>
            </li>
            <li>
              <a href="#">Cài Đặt</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Tài Nguyên</h4>
          <ul>
            <li>
              <a href="#">Trung Tâm Trợ Giúp</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Quy Định Cộng Đồng</a>
            </li>
            <li>
              <a href="#">Đối Tác</a>
            </li>
            <li>
              <a href="#">Thuế</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Công Ty</h4>
          <ul>
            <li>
              <a href="#">Về Chúng Tôi</a>
            </li>
            <li>
              <a href="#">Tuyển Dụng</a>
            </li>
            <li>
              <a href="#">Truyền Thông</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Học Hỏi</h4>
          <ul>
            <li>
              <a href="#">Cách Mua Vé</a>
            </li>
            <li>
              <a href="#">Cách Bán Vé</a>
            </li>
            <li>
              <a href="#">Chính Sách Vé</a>
            </li>
            <li>
              <a href="#">Phương Thức Thanh Toán</a>
            </li>
            <li>
              <a href="#">Giao Dịch An Toàn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 TicketResell. Thiết kế web bởi Quang.</p>
        <div className="footer-links">
          <a href="#">Chính Sách Bảo Mật</a>
          <a href="#">Điều Khoản Dịch Vụ</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
