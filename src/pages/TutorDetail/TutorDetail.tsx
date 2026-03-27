import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTutorById } from "../../shared/api/tutorApi";
import { mapTutor } from "../../shared/api/tutorMapper";

export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getTutorById(Number(id));
        if (!data) return;

        setTutor(mapTutor(data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!tutor) {
    return (
      <div className="p-10 text-center text-gray-500">
        Không tìm thấy gia sư
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen py-10 select-none">
      <div className="max-w-5xl mx-auto px-4">

        <div className="mb-4 text-sm flex items-center gap-1">
          <span
            onClick={() => navigate("/")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            💠
          </span>

          <span className="text-gray-400">/</span>

          <span
            onClick={() => navigate("/tutors")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Gia sư tiêu biểu
          </span>

          <span className="text-gray-400">/</span>
          <span className="text-gray-600">
            Chi tiết gia sư
          </span>
        </div>

       <div className="bg-white border-2 border-blue-400 rounded-2xl shadow-lg p-8 flex gap-8">

          <div className="w-48 h-48 shrink-0">
            <img
              src={tutor.avatarUrl}
              alt={tutor.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2 text-gray-700">

              <p><span className="font-semibold">Mã số: <span className="text-red-600">GSTT{tutor.id} </span>
              </span>
              </p>

              <p className="text-2xl font-bold text-blue-600">
                {tutor.name}
              </p>
              <p><span className="font-semibold">Gia sư: </span> {tutor.fullName}</p>
              <p><span className="font-semibold">Trường: </span> {tutor.school}</p>
              <p><span className="font-semibold">Kinh nghiệm:</span> {tutor.experience}</p>
              <p><span className="font-semibold">Thành tích:</span> {tutor.achievements}</p>
              <p><span className="font-semibold">Khu vực dạy:</span> {tutor.teaching_area}</p>
              <p><span className="font-semibold">Thời gian rảnh:</span> {tutor.availableTime}</p>
              <p><span className="font-semibold">Giới thiệu:</span> {tutor.bio}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition">
                💬 Chat Đặt lớp
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}