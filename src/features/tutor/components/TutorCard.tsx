import { FiArrowRight, FiAward, FiBookOpen, FiClock, FiMapPin } from "react-icons/fi";
import type { Tutor } from "../model/tutorTypes";

type Props = {
  tutor: Tutor;
  onClick: () => void;
};

const trimText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
};

export default function TutorCard({ tutor, onClick }: Props) {
  return (
    <div
      className="w-full max-w-[336px] cursor-pointer select-none overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.1)]"
    >
      <div className="h-32 overflow-hidden bg-slate-100">
        <img
          src={tutor.avatarUrl || "/default-avatar.png"}
          alt={tutor.fullName}
          className="h-full w-full object-cover transition duration-300"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="text-[19px] font-bold leading-7 text-slate-900">
            {tutor.fullName}
          </h3>

          <p className="text-sm leading-6 text-[#333]">
            {trimText(tutor.school, 40)}
          </p>
        </div>

        <div className="space-y-2.5 text-[13px] leading-6 text-[#333]">
          <p className="flex items-start gap-3">
            <FiAward className="mt-1 h-4 w-4 flex-none text-sky-600" />
            <span>{trimText(tutor.achievements, 48)}</span>
          </p>

          <p className="flex items-start gap-3">
            <FiBookOpen className="mt-1 h-4 w-4 flex-none text-sky-600" />
            <span>{trimText(tutor.experience, 48)}</span>
          </p>

          <p className="flex items-start gap-3">
            <FiMapPin className="mt-1 h-4 w-4 flex-none text-sky-600" />
            <span>{trimText(tutor.teachingArea, 42)}</span>
          </p>

          <p className="flex items-start gap-3">
            <FiClock className="mt-1 h-4 w-4 flex-none text-sky-600" />
            <span>{trimText(tutor.availableTime, 38)}</span>
          </p>
        </div>

        <div className="mt-2 mr-4 mb-4 flex items-center justify-end border-t border-slate-100 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-xs font-medium text-white transition hover:bg-sky-700"
          >
            {"Xem hồ sơ"}
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
