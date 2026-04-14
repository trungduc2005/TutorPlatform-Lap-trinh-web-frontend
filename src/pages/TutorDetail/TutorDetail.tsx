import { FiArrowLeft, FiBookOpen, FiMapPin, FiMonitor, FiUser } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useTutorDetail } from "../../features/tutor/hooks/useTutorDetail";

const isOnlineTeaching = (teachingArea: string) => /online|trực tuyến/i.test(teachingArea);

export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tutor, loading, error } = useTutorDetail(Number(id));

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!tutor) {
    return <p className="p-10 text-center text-gray-500">{"Không tìm thấy gia sư"}</p>;
  }

  const profileHighlights = [
    { label: "Kinh nghiệm", value: tutor.experience, icon: FiBookOpen },
    { label: "Khu vực", value: tutor.teachingArea, icon: FiMapPin },
    {
      label: "Hình thức",
      value: isOnlineTeaching(tutor.teachingArea) ? "Online và trực tiếp" : "Trực tiếp",
      icon: FiMonitor,
    },
  ];

  const detailItems = [
    { label: "Trường", value: tutor.school },
    { label: "Kinh nghiệm", value: tutor.experience },
    { label: "Khu vực dạy", value: tutor.teachingArea },
    { label: "Thời gian rảnh", value: tutor.availableTime },
    { label: "Giới thiệu", value: tutor.bio },
  ];

  return (
    <div className="min-h-screen select-none bg-gray-200 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <button
          type="button"
          onClick={() => navigate("/featured-tutors")}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
        >
          <FiArrowLeft className="h-4 w-4" />
          {"Quay lại danh sách"}
        </button>

        <div className="mb-7">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{"Chi tiết gia sư"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {"Xem nhanh hồ sơ nổi bật và thông tin chi tiết của gia sư."}
          </p>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,760px)]">
          <aside className="rounded-3xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={tutor.avatarUrl}
                alt={tutor.fullName}
                className="h-[220px] w-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-2.5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{"Mã số"}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">GSTT{tutor.id}</p>
              </div>

              <div>
                <h2 className="text-[26px] font-bold leading-8 text-slate-900">{tutor.fullName}</h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{tutor.school}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {profileHighlights.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2.5"
                >
                  <Icon className="mt-0.5 h-4 w-4 flex-none text-sky-600" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-0.5 text-sm leading-5 text-slate-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <div className="space-y-3">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-1.5 rounded-2xl border border-slate-100 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)] md:items-start"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <FiUser className="h-4 w-4 text-sky-600" />
                    <span>{item.label}</span>
                  </div>
                  <div className="text-[15px] leading-7 text-slate-800">{item.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
