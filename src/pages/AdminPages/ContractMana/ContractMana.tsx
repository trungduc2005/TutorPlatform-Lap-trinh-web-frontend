import { Form } from "antd";
import "./ContractMana.css";

export default function ContractMana() {
    return (
        
        <div className="contract-body">
            <Form className="contract-form">
                <div className="contract-header">
                    <h1>
                        Điều khoản sử dụng <br />
                        Hệ thống kết nối gia sư với phụ huynh, học sinh
                    </h1>
                </div>
                <div className="contract-content">
                    <b>1. Giới thiệu</b> <br />
                    Hệ Thống Kết Nối Gia Sư Với Phụ Huynh (sau đây gọi là Hệ Thống) là nền tảng trực tuyến cung cấp dịch vụ kết nối giữa Gia sư và Phụ huynh/Học viên.<br />
                    Hệ Thống không trực tiếp cung cấp dịch vụ giảng dạy và không phải là đơn vị đào tạo. Hệ Thống chỉ đóng vai trò trung gian kết nối và hỗ trợ đảm bảo giao dịch giữa các bên.<br />
                    Việc đăng ký tài khoản hoặc sử dụng dịch vụ đồng nghĩa với việc người dùng đã đọc, hiểu và đồng ý với toàn bộ Điều khoản này.<br />
                    <b>2. Vai trò và phạm vi trách nhiệm của Hệ Thống</b><br />
                    Hệ Thống có trách nhiệm:<br />
                    Cung cấp nền tảng đăng tải và tìm kiếm lớp học.<br />
                    Hỗ trợ kết nối giữa Gia sư và Phụ huynh.<br />
                    Hỗ trợ xử lý khi có tranh chấp phát sinh trong phạm vi dịch vụ.<br />
                    Thu phí dịch vụ kết nối theo quy định.<br />
                    Hệ Thống không:<br />
                    Can thiệp vào nội dung giảng dạy.<br />
                    Điều phối lịch học.<br />
                    Chịu trách nhiệm đối với các thỏa thuận riêng ngoài nền tảng.<br />
                    <b>3. Tài khoản và thông tin người dùng</b><br />
                    3.1. Đối với Gia sư<br />
                    Gia sư cam kết:<br />
                    Cung cấp thông tin cá nhân trung thực, chính xác.<br />
                    Chịu trách nhiệm về bằng cấp, chứng chỉ đã cung cấp.<br />
                    Liên hệ Phụ huynh trong vòng 02 giờ kể từ khi nhận lớp.<br />
                    Không tự ý chuyển giao lớp cho người khác.<br />
                    Thực hiện giảng dạy đúng nội dung đã thỏa thuận.<br />
                    3.2. Đối với Phụ huynh<br />
                    Phụ huynh cam kết:<br />
                    Cung cấp thông tin lớp học chính xác.<br />
                    Thanh toán học phí đúng hạn cho Gia sư theo thỏa thuận.<br />
                    Không cung cấp thông tin sai lệch nhằm trục lợi.<br />
                    Hệ Thống có quyền tạm khóa hoặc chấm dứt tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm Điều khoản.<br />
                    <b>4. Phí dịch vụ (Phí nhận lớp)</b><br />
                    Phí nhận lớp là khoản phí Gia sư thanh toán để sử dụng dịch vụ kết nối và đảm bảo giao dịch của Hệ Thống.<br />
                    Mức phí: 35% học phí tháng đầu.<br />
                    Hình thức thanh toán: chuyển khoản qua mã QR sau khi nhận lớp.<br />
                    Thời điểm thanh toán: Trước khi nhận đầy đủ thông tin lớp học.<br />
                    Phí này không phải là học phí và không phải khoản thanh toán thay cho Phụ huynh.<br />
                    <b>5. Chính sách hoàn phí</b><br />
                    Phí nhận lớp được xem xét hoàn lại trong các trường hợp:<br />
                    Lớp học không tồn tại.<br />
                    Thông tin lớp sai lệch nghiêm trọng.<br />
                    Phụ huynh hủy lớp trước buổi học đầu tiên.<br />
                    Các trường hợp đặc biệt có xác minh rõ ràng.<br />
                    Phí không được hoàn lại nếu:<br />
                    Gia sư không liên hệ đúng thời gian quy định.<br />
                    Gia sư tự ý hủy lớp.<br />
                    Gia sư vi phạm Điều khoản sử dụng.<br />
                    Hai bên tự ý thay đổi thỏa thuận ngoài phạm vi thông tin ban đầu.<br />
                    Thời gian xử lý hoàn phí: ___ ngày làm việc kể từ khi nhận đủ thông tin.<br />
                    <b>6. Xử lý tranh chấp</b><br />
                    Khi phát sinh tranh chấp:<br />
                    Các bên phải cung cấp thông tin và bằng chứng liên quan.<br />
                    Hệ Thống sẽ xác minh và đề xuất phương án xử lý dựa trên dữ liệu thu thập được.<br />
                    Thời gian xử lý dự kiến: 03 ngày làm việc.<br />
                    Trong trường hợp không đạt được thỏa thuận, các bên có quyền đưa vụ việc ra cơ quan có thẩm quyền theo quy định pháp luật.<br />
                    <b>7. Giới hạn trách nhiệm</b><br />
                    Hệ Thống không chịu trách nhiệm đối với:<br />
                    Chất lượng giảng dạy và kết quả học tập.<br />
                    Hành vi cá nhân giữa Gia sư và Phụ huynh.<br />
                    Các thiệt hại gián tiếp hoặc phát sinh ngoài phạm vi dịch vụ kết nối.<br />
                    Trong mọi trường hợp, trách nhiệm tối đa của Hệ Thống (nếu có) không vượt quá số phí dịch vụ đã thu.<br />
                    <b>8. Tạm khóa hoặc chấm dứt tài khoản</b><br />
                    Hệ Thống có quyền:<br />
                    Tạm khóa tài khoản khi phát hiện dấu hiệu vi phạm.<br />
                    Chấm dứt quyền sử dụng dịch vụ nếu có hành vi gian lận, gây thiệt hại hoặc ảnh hưởng đến uy tín hệ thống.<br />
                    <b>9. Hiệu lực</b><br />
                    Điều khoản này có hiệu lực kể từ thời điểm người dùng đăng ký tài khoản và sử dụng dịch vụ trên Hệ Thống.<br />
                </div>
            </Form>
        </div>
    )
}