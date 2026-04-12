import heroBg from "../../assets/hero-rabbit-bg-v2.png";
import studentImg from "../../assets/student-section.svg";
import starImg from "../../assets/star-icon.svg";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
  return (
    <div className="bg-gray-100">

      <div
        className="py-24 relative select-none"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
            <p className="text-sm mb-2">
              <span className="font-bold">
                Hệ thống kết nối gia sư và phụ huynh
              </span>
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mb-3">
              Mang thành công đến với con bạn
            </h2>

            <p className="text-gray-500 text-sm mb-2">
              Bạn muốn con mình chăm ngoan, học giỏi? Đăng ký ngay!
            </p>

            <p className="text-gray-500 text-sm mb-4">
              Đội ngũ gia sư của chúng tôi sẽ giúp con bạn tiến bộ nhanh chóng.
            </p>

            <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              ➤ Đăng ký thuê gia sư ngay
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white select-none">
        <div className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
          <img src={studentImg} className="rounded-lg" />

          <div>
            <h2 className="text-xl font-bold mb-3">Bạn là sinh viên?</h2>

            <p className="text-gray-600 mb-4">
              Gia nhập vào đội ngũ gia sư của Hệ thống kết nối gia sư và phụ huynh,
              nhận lớp và có thêm thu nhập từ những kiến thức, kỹ năng giảng dạy của bạn.
            </p>

           <div className="flex gap-4 mb-4 text-blue-500 text-sm">
             <span
               onClick={() => navigate("/register")}
               className="cursor-pointer hover:underline"
             >
               ✔ Đăng ký làm gia sư
             </span>

             <span
               onClick={() => navigate("/login")}
               className="cursor-pointer hover:underline"
             >
               ✔ Đăng nhập
             </span>

             <span
              onClick={() => navigate("/classes")}
              className="cursor-pointer hover:underline">
               ✔ Xem lớp
             </span>
           </div>

            <button
                onClick={() => navigate("/register")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Đến trang gia sư
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 px-6 select-none">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          <div>
            <h2 className="text-2xl font-bold leading-relaxed">
              Dịch vụ tại hệ thống <br />
              kết nối gia sư và phụ huynh
            </h2>
          </div>

          <div className="space-y-6">
            <p className="font-bold text-xl mb-6">
              Hệ thống kết nối gia sư và phụ huynh luôn nỗ lực để cung cấp cho bạn dịch vụ gia sư chất lượng nhất, bao gồm:
            </p>

            {[
              {
                title: "Các môn phổ thông",
                description: "Bao gồm các môn học trong chương trình phổ thông: Gia sư Toán, Vật Lý, Hóa Học, Sinh Học, Văn, Lịch Sử, Địa Lý, Tiếng Anh, Gia sư Tiểu Học, và nhiều môn học khác nữa."
              },
              {
                title: "Các môn ngoại ngữ",
                description: "Bao gồm gia sư dạy ngữ pháp và giao tiếp cho các môn học: Tiếng Anh, Tiếng Nhật, Tiếng Hàn, Tiếng Pháp, Tiếng Trung, Tiếng Tây Ban Nha và các môn ngoại ngữ khác."
              },
              {
                title: "Các môn năng khiếu",
                description: "Bao gồm các môn nghệ thuật như: Piano, Guitar, Organ, Mỹ Thuật, Thanh Nhạc. Đối với những môn năng khiếu này, để có được gia sư, có thể sẽ cần nhiều thời gian sắp xếp hơn."
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-4">

                <div className="w-8 h-8 flex items-center flex-shrink-0 justify-center rounded-full bg-blue-500 text-white font-bold">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>
      </div>

      <div className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="h-px bg-blue-400"></div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
            <div className="w-4 h-4 bg-red-500 rotate-45"></div>
          </div>
        </div>
      </div>

      <div className="bg-white select-none">
        <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
          <img src={starImg} className="rounded-lg" />

          <div>
            <h2 className="text-xl font-bold mb-3">
              Tạo dựng tương lai cho con
            </h2>

            <p className="text-gray-600 mb-4">
              Cùng Hệ thống kết nối gia sư và phụ huynh giúp con học giỏi và mang đến cho con một tương lai tốt đẹp. Dù con bạn đang ở mức học lực nào, chúng tôi đều có thể giúp bạn. Hãy liên hệ với bộ phận Quản Lý Đào Tạo để được tư vấn tốt nhất.
            </p>

            <div className="flex gap-4">
              <button
               onClick={() => navigate("/register")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                → Đăng ký thuê gia sư ngay
              </button>

              <h3 className="px-4 py-2">
                📞 Gọi tư vấn: 0123456789
              </h3>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}