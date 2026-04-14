import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TutorCard from "../../features/tutor/components/TutorCard";
import { useTutorList } from "../../features/tutor/hooks/useTutorList";

export default function TutorsList() {
  const navigate = useNavigate();

  const { tutors, loading, error } = useTutorList();

  const [block, setBlock] = useState(0);
  const pagesPerBlock = 4;

  const itemsPerPage = 8;
  const [page, setPage] = useState(1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const totalPages = Math.ceil(tutors.length / itemsPerPage);

  const currentData = tutors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const renderPagination = () => {
    const pages = [];

    const start = block * pagesPerBlock + 1;
    const end = Math.min(start + pagesPerBlock - 1, totalPages);

    if (block > 0) {
      pages.push(
        <button
          key="prev"
          onClick={() => {
            setBlock(0);
            setPage(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-white text-xs text-gray-700 hover:bg-blue-50"
        >
          {"<"}
        </button>
      );
    }

    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          onClick={() => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex h-8 w-8 items-center justify-center rounded-md border text-xs ${
            p === page
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-blue-200 bg-white text-gray-700 hover:bg-blue-50"
          }`}
        >
          {p}
        </button>
      );
    }

    if (end < totalPages) {
      pages.push(
        <button
          key="dots"
          onClick={() => {
            setBlock(block + 1);
            setPage(end + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex h-8 w-8 items-center justify-center text-xs text-gray-500"
        >
          ...
        </button>
      );

      pages.push(
        <button
          key="next"
          onClick={() => {
            const lastBlock = Math.floor((totalPages - 1) / pagesPerBlock);
            setBlock(lastBlock);
            setPage(totalPages);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 bg-white text-xs text-gray-700 hover:bg-blue-50"
        >
          {">"}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen select-none bg-gray-200 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-7">
            <h1 className="text-4xl font-bold tracking-tight text-slate-800">{"Gia sư tiêu biểu"}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {"Chọn nhanh những gia sư nổi bật về thành tích, kinh nghiệm và khu vực dạy phù hợp."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentData.map((tutor) => (
              <TutorCard
                key={tutor.featuredId}
                tutor={tutor}
                onClick={() => navigate(`/tutors/${tutor.id}`)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
}
