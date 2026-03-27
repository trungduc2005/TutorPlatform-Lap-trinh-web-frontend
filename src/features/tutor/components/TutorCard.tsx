type Tutor = {
  id: number;
  fullName: string;
  school: string;
  achievements: string;
  experience: string;
  avatarUrl: string;
};
type Props = {
  tutor: Tutor;
  onClick: () => void;
};
export default function TutorCard({ tutor, onClick }: Props) {
  return (
    <div
      className="w-[260px] border border-blue-200 rounded-xl overflow-hidden bg-white
      shadow-sm flex flex-col hover:shadow-lg
      transition-all duration-300
      hover:-translate-y-1 hover:scale-[1.02] cursor-pointer select-none"
    >
      <div className="h-40 bg-blue-50 overflow-hidden">
        <img
          src={tutor.avatarUrl || "/default-avatar.png"}
          alt={tutor.fullName}
          className="w-full h-full object-cover transition duration-300"
        />
      </div>

      <div className="p-3 text-xs flex flex-col gap-1 flex-1">

        <h3 className="font-semibold text-sm text-gray-800 leading-5">
          {tutor.fullName}
        </h3>

        <p className="text-gray-500 mt-1 leading-5">
          {tutor.school}
        </p>

        <div className="mt-2 space-y-1 text-gray-600 flex-1">
          <p>
            🏅 Thành tích: {tutor.achievements}
          </p>
          <p>
            📅 Kinh nghiệm: {tutor.experience}
          </p>
          <p>
            📍Địa chỉ: {tutor.teaching_area}
          </p>
          <p>
            ⏰ Thời gian: {tutor.availableTime}
          </p>
        </div>

        <div className="border-t mt-auto pt-2 h-12 flex items-center justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="bg-blue-600 text-white text-xs px-4 py-1 rounded-full hover:bg-blue-700 transition"
          >
            Xem hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}