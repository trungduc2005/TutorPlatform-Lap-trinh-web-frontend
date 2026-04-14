export default function ContractMana() {
  return (
    <div className="min-h-screen select-none bg-gray-200 py-10">
      <div className="mx-auto max-w-3xl bg-white p-10 shadow-md">
        <h1 className="mb-4 text-center text-lg font-bold">ĐIỀU KHOẢN SỬ DỤNG</h1>

        <h2 className="mb-6 text-center text-base font-semibold">
          HỆ THỐNG KẾT NỐI GIA SƯ VỚI PHỤ HUYNH
        </h2>

        <div className="space-y-3 text-sm leading-6 text-gray-800">
          <p><b>1. Giới thiệu</b></p>
          <p>
            Hệ Thống Kết Nối Gia Sư Với Phụ Huynh (sau đây gọi là Hệ Thống) là nền tảng trực tuyến cung cấp dịch vụ
            kết nối giữa gia sư và phụ huynh hoặc học viên.
          </p>
          <p>
            Hệ Thống không trực tiếp cung cấp dịch vụ giảng dạy và không phải là đơn vị đào tạo. Hệ Thống chỉ đóng vai trò
            trung gian kết nối và hỗ trợ đảm bảo giao dịch giữa các bên. Việc đăng ký tài khoản hoặc sử dụng dịch vụ đồng nghĩa
            với việc người dùng đã đọc, hiểu và đồng ý với toàn bộ điều khoản này.
          </p>

          <p><b>2. Vai trò và trách nhiệm của Hệ Thống</b></p>
          <p>Hệ thống có trách nhiệm:</p>
          <ul className="list-disc pl-5">
            <li>Cung cấp nền tảng đăng tải và tìm kiếm lớp học.</li>
            <li>Hỗ trợ kết nối giữa gia sư và phụ huynh.</li>
            <li>Hỗ trợ xử lý khi có tranh chấp phát sinh trong phạm vi dịch vụ.</li>
            <li>Thu phí dịch vụ kết nối theo quy định.</li>
          </ul>

          <p><b>3. Tài khoản và thông tin người dùng</b></p>
          <p><b>3.1 Đối với gia sư</b></p>
          <p>Gia sư cam kết:</p>
          <ul className="list-disc pl-5">
            <li>Cung cấp thông tin cá nhân trung thực, chính xác.</li>
            <li>Chịu trách nhiệm về bằng cấp, chứng chỉ đã cung cấp.</li>
            <li>Liên hệ phụ huynh trong vòng 02 giờ kể từ khi nhận lớp.</li>
            <li>Không tự ý chuyển giao lớp cho người khác.</li>
            <li>Thực hiện giảng dạy đúng nội dung đã thỏa thuận.</li>
          </ul>

          <p><b>3.2 Đối với phụ huynh</b></p>
          <p>Phụ huynh cam kết:</p>
          <ul className="list-disc pl-5">
            <li>Cung cấp thông tin lớp học chính xác.</li>
            <li>Thanh toán học phí đúng hạn cho gia sư theo thỏa thuận.</li>
            <li>Không cung cấp thông tin sai lệch nhằm trục lợi.</li>
          </ul>
          <p>
            Hệ Thống có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm điều khoản.
          </p>

          <p><b>4. Phí dịch vụ (Phí nhận lớp)</b></p>
          <p>
            Phí nhận lớp là khoản phí gia sư thanh toán để sử dụng dịch vụ kết nối và đảm bảo giao dịch của Hệ Thống.
          </p>
          <ul className="list-disc pl-5">
            <li>Mức phí: 35% học phí tháng đầu.</li>
            <li>Hình thức thanh toán: chuyển khoản qua mã QR sau khi nhận lớp.</li>
            <li>Thời điểm thanh toán: trước khi nhận đầy đủ thông tin lớp học.</li>
            <li>Phí này không phải là học phí và không phải khoản thanh toán thay cho phụ huynh.</li>
          </ul>

          <p><b>5. Chính sách hoàn phí</b></p>
          <p>Phí nhận lớp được xem xét hoàn lại trong các trường hợp:</p>
          <ul className="list-disc pl-5">
            <li>Lớp học không tồn tại.</li>
            <li>Thông tin lớp sai lệch nghiêm trọng.</li>
            <li>Phụ huynh hủy lớp trước buổi học đầu tiên.</li>
            <li>Các trường hợp đặc biệt nếu có xác minh rõ ràng.</li>
          </ul>
          <p>Phí không được hoàn lại nếu:</p>
          <ul className="list-disc pl-5">
            <li>Gia sư không liên hệ đúng thời gian quy định.</li>
            <li>Gia sư tự ý hủy lớp.</li>
            <li>Gia sư vi phạm điều khoản sử dụng.</li>
            <li>Hai bên tự ý thay đổi thỏa thuận ngoài phạm vi thông tin ban đầu.</li>
          </ul>
          <p>Thời gian xử lý hoàn phí: ___ ngày làm việc kể từ khi nhận đủ thông tin.</p>

          <p><b>6. Xử lý tranh chấp</b></p>
          <p>Khi phát sinh tranh chấp:</p>
          <ol className="list-decimal pl-5">
            <li>Các bên cung cấp thông tin và bằng chứng liên quan để giải quyết.</li>
            <li>Hệ Thống xác minh và đề xuất phương án xử lý dựa trên dữ liệu thu thập được.</li>
            <li>Thời gian xử lý dự kiến: 03 ngày làm việc.</li>
            <li>
              Nếu không đạt được thỏa thuận, các bên có quyền đưa vụ việc ra cơ quan có thẩm quyền theo quy định pháp luật.
            </li>
          </ol>

          <p><b>7. Giới hạn trách nhiệm</b></p>
          <p>Hệ Thống không chịu trách nhiệm đối với:</p>
          <ul className="list-disc pl-5">
            <li>Chất lượng giảng dạy và kết quả học tập.</li>
            <li>Hành vi cá nhân giữa gia sư và phụ huynh.</li>
            <li>Các thiệt hại gián tiếp hoặc phát sinh ngoài phạm vi dịch vụ kết nối.</li>
          </ul>
          <p>
            Trong mọi trường hợp, trách nhiệm tối đa của Hệ Thống (nếu có) không vượt quá số phí dịch vụ đã thu.
          </p>

          <p><b>8. Tạm khóa hoặc chấm dứt tài khoản</b></p>
          <p>Hệ Thống có quyền:</p>
          <ul className="list-disc pl-5">
            <li>Tạm khóa tài khoản khi phát hiện dấu hiệu vi phạm.</li>
            <li>Chấm dứt quyền sử dụng dịch vụ nếu có hành vi gian lận, gây thiệt hại hoặc ảnh hưởng đến uy tín hệ thống.</li>
          </ul>

          <p><b>9. Hiệu lực</b></p>
          <p>
            Điều khoản này có hiệu lực kể từ thời điểm người dùng đăng ký tài khoản và sử dụng dịch vụ trên Hệ Thống.
          </p>
          <p className="mt-6 text-center">- Hết -</p>
        </div>
      </div>
    </div>
  );
}
