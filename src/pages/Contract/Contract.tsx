import { useNavigate } from "react-router-dom";

export default function Contract() {
      const navigate = useNavigate();
  return (
    <div className="bg-gray-200 min-h-screen py-10 select-none">

      <div className="max-w-5xl mx-auto px-4 mb-4 text-sm text-gray-500">
            <span onClick ={() => navigate("/")}
            className="text-blue-500 cursor-pointer hover:underline"
            > 💠
              </span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600"> Hợp đồng mẫu</span>
                  </div>


      {/* DOCUMENT */}
      <div className="max-w-3xl mx-auto bg-white p-10 shadow-md">

        {/* TITLE */}
        <h1 className="text-center font-bold text-lg mb-4">
          ĐIỀU KHOẢN SỬ DỤNG
        </h1>

        <h2 className="text-center font-semibold text-base mb-6">
          HỆ THỐNG KẾT NỐI GIA SƯ VỚI PHỤ HUYNH
        </h2>

        {/* CONTENT */}
        <div className="text-sm text-gray-800 leading-6 space-y-3">

          <p><b>1. Giới thiệu</b></p>
          <p>
            Hệ Thống Kết Nối Gia Sư Với Phụ Huynh (sau đây gọi là Hệ Thống) là nền tảng trực tuyến cung cấp dịch vụ kết nối
            giữa Gia sư và Phụ huynh/Học viên.
          </p>

          <p>
           Hệ Thống không trực tiếp cung cấp dịch vụ giảng dạy và không phải là đơn vị đào tạo. Hệ Thống chỉ đóng vai trò trung gian kết nối và hỗ trợ đảm bảo giao dịch giữa các bên. Việc đăng ký tài khoản hoặc sử dụng dịch vụ
           đồng nghĩa với việc người dùng đã đọc, hiểu và đồng ý với toàn bộ Điều khoản này.
          </p>

          <p><b>2. Vai trò và trách nhiệm của Hệ Thống</b></p>
          <p>Hệ thống có trách nhiệm: </p>
          <ul className="list-disc pl-5">
            <li>Cung cấp nền tảng đăng tải và tìm kiếm lớp học.</li>
            <li>Hỗ trợ kết nối giữa gia sư và phụ huynh.</li>
            <li>Hỗ trợ xử lý khi có tranh chấp phát sinh trong phạm vi dịch vụ.</li>
            <li>Thu phí dịch vụ kết nối theo quy định.</li>
          </ul>

          <p><b>3. Tài khoản và thông tin người dùng</b></p>
          <p><b>3.1 Đối với Gia sư</b></p>
          <p>Gia sư cam kết: </p>
          <ul className="list-disc pl-5">
            <li>Cung cấp thông tin cá nhân trung thực, chính xác.</li>
            <li>Chịu trách nhiệm về bằng cấp, chứng chỉ đã cung cấp.</li>
            <li>Liên hệ Phụ huynh trong vòng 02 giờ kể từ khi nhận lớp.</li>
            <li>Không tự ý chuyển giao lớp cho người khác.</li>
            <li>Thực hiện giảng dạy đúng nội dung đã thoả thuận.</li>
          </ul>

          <p><b>3.2 Đối với Phụ huynh</b></p>
          <p>Phụ huynh cam kết: </p>
          <ul className="list-disc pl-5">
            <li>Cung cấp thông tin lớp học chính xác.</li>
            <li>Thanh toán học phí đúng hạn cho gia sư theo thoả thuận.</li>
            <li>Không cung cấp thông tin sai lệch nhằm trục lợi.</li>
          </ul>
          <p>Hệ Thống có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện hành vi
          gian lận hoặc vi phạm Điều khoản. </p>

          <p><b>4. Phí dịch vụ (Phí nhận lớp)</b></p>
          <p>Phí nhận lớp là khoản phí Gia sư thanh toán để sử dụng dịch vụ
          kết nối và đảm bảo giao dịch của Hệ Thống.</p>
          <ul className="list-disc pl-5">
              <li>Mức phí: 35% học phí tháng đầu.</li>
              <li>Hình thức thanh toán: chuyển khoản qua mã QR sau khi nhận lớp.</li>
              <li>Thời điểm thanh toán: Trước khi nhận đầy đủ thông tin lớp học.
              Phí này không phải là học phí và không phải khoản thanh toán thay cho Phụ huynh.</li>
          </ul>

          <p><b>5. Chính sách hoàn phí</b></p>
          <p>Phí nhận lớp được xem xét hoàn lại trong các trường hợp:</p>
          <ul className="list-disc pl-5">
            <li>Lớp học không tồn tại</li>
            <li>Thông tin lớp sai lệch nghiêm trọng</li>
            <li>Phụ huynh huỷ lớp trước buổi học đầu tiên.</li>
            <li>Các trường hợp đặc biệt nếu có xác minh rõ ràng.</li>
          </ul>
          <p>Phí không được hoàn lại nếu:</p>
          <ul className="list-disc pl-5">
            <li>Gia sư không liên hệ đúng thời gian quy định.</li>
            <li>Gia sư tự ý hủy lớp.</li>
            <li>Gia sư vi phạm Điều khoản sử dụng.</li>
            <li>Gia sư vi phạm Điều khoản sử dụng. Hai bên tự ý thay đổi thỏa thuận ngoài phạm vi thông tin ban đầu. <br />
             Thời gian xử lý hoàn phí: ___ ngày làm việc kể từ khi nhận đủ thông tin.</li>
          </ul>

          <p><b>6. Xử lý tranh chấp</b></p>
          <p>Khi phát sinh tranh chấp:</p>
          <ul className="number-list pl-5">
          <li><b>1.</b> Các bên cung cấp thông tin và bằng chứng liên quan để giải quyết.</li>
          <li><b>2.</b> Hệ Thống sẽ xác minh và đề xuất phương án xử lý dựa trên dữ liệu thu thập được.</li>
          <li><b>3.</b> Thời gian xử lý dự kiến: 03 ngày làm việc.</li>
          <li><b>4.</b> Trong trường hợp không đạt được thỏa thuận, các bên có quyền đưa vụ việc ra cơ quan có thẩm quyền theo quy định pháp luật.</li>
          </ul>

          <p><b>7. Giới hạn trách nhiệm</b></p>
          <p>
            Hệ Thống không chịu trách nhiệm đối với:
          </p>
          <ul className="list-disc pl-5">
          <li>Chất lượng giảng dạy và kết quả học tập.</li>
          <li>Hành vi cá nhân giữa Gia sư và Phụ huynh.</li>
          <li>Các thiệt hại gián tiếp hoặc phát sinh ngoài phạm vi dịch vụ kết nối.
          Trong mọi trường hợp, trách nhiệm tối đa của Hệ Thống (nếu có) không vượt
          quá số phí dịch vụ đã thu.</li>
          </ul>

          <p><b>8. Tạm khóa hoặc chấm dứt tài khoản</b></p>
          <p>
            Hệ thống có quyền:
          </p>
          <ul className="list-disc pl-5">
          <li>Tạm khóa tài khoản khi phát hiện dấu hiệu vi phạm.</li>
          <li>Chấm dứt quyền sử dụng dịch vụ nếu có hành vi gian lận,
          gây thiệt hại hoặc ảnh hưởng đến uy tín hệ thống.</li>
          </ul>

          <p><b>9. Hiệu lực</b></p>
          <p>Điều khoản này có hiệu lực kể từ thời điểm người dùng đăng ký
          tài khoản và sử dụng dịch vụ trên Hệ Thống.</p>
          <p className="text-center mt-6">– Hết –</p>
        </div>

      </div>
    </div>
  );
}