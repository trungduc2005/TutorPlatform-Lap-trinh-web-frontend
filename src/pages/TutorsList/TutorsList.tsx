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
          className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded-md bg-white hover:bg-blue-50 text-xs text-gray-700"
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
          className={`w-8 h-8 flex items-center justify-center border rounded-md text-xs ${
            p === page
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white border-blue-200 text-gray-700 hover:bg-blue-50"
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
          className="w-8 h-8 flex items-center justify-center text-gray-500 text-xs"
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
          className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded-md bg-white hover:bg-blue-50 text-xs text-gray-700"
        >
          {">"}
        </button>
      );
    }

    return pages;
  };

  return (
      <div className="bg-gray-200 min-h-screen py-10 select-none">
        <div className="max-w-5xl mx-auto px-4">

          <div className="mb-4 text-sm text-gray-600">
          <span onClick={() => navigate("/")}
          className="text-blue-500 cursor-pointer hover:underline">
          💠
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600"> Gia sư tiêu biểu </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 justify-items-center">
            {currentData.map((tutor) => (
              <TutorCard
                key={tutor.featuredId}
                tutor={tutor}
                onClick={() => navigate(`/tutors/${tutor.id}`)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {renderPagination()}
          </div>

        </div>
      </div>
    );
}