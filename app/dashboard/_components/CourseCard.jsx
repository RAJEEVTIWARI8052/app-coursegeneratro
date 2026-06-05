import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoBookOutline, IoEllipsisVerticalOutline } from "react-icons/io5";
import DropDownoptions from "./DropDownoption";

// Utility function to safely parse course output
function parseCourseOutput(courseOutput) {
  if (!courseOutput) return 0;
  try {
    const parsed = typeof courseOutput === 'string' ? JSON.parse(courseOutput) : courseOutput;
    return parsed?.course?.numberOfChapters || parsed?.numberOfChapters || parsed?.chapters?.length || 0;
  } catch {
    return 0;
  }
}

function CourseCard({ course, refreshData, displayUser = false, priority = false }) {
  const bannerUrl =
    course?.courseBanner ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&crop=center";

  const numberOfChapters = parseCourseOutput(course?.courseOutput);
  const level = course?.level || "Beginner";

  const handleOnDelete = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${course?.name}"?`)) return;

    try {
      const response = await fetch(`/api/course/${course.courseId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }
      const result = await response.json();
      if (result.message && typeof refreshData === 'function') {
        await refreshData();
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      alert(`Failed to delete course: ${err.message}`);
    }
  };

  return (
    <div className="group card-hover w-full h-full relative">
      {/* Ambient glow — pure CSS, no JS */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10" />

      <div className="shadow-2xl rounded-2xl flex flex-col gap-3 p-4 glass border border-white/20 cursor-pointer h-full z-10 backdrop-blur-2xl relative overflow-hidden bg-white/5 dark:bg-black/20">
        <Link href={`/create-course/${course.courseId}`} passHref>
          {/* ✅ CSS-only hover: image zoom + gradient reveal — no video fetch, no state */}
          <div className="relative h-[200px] w-full rounded-xl overflow-hidden shadow-inner bg-black">
            <Image
              loader={({ src }) => src}
              src={bannerUrl}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              alt={course?.name || "Course image"}
              loading={priority ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            {/* Hover gradient overlay — pure CSS, zero JS re-renders */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <span className="text-white text-sm font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                View Course →
              </span>
            </div>
          </div>
        </Link>

        <div className="p-2 flex-col flex justify-between flex-1">
          <div>
            <h2 className="font-bold text-lg flex items-center justify-between mb-1">
              <Link href={`/create-course/${course.courseId}`} className="line-clamp-1 hover:text-purple-400 transition-colors duration-200">
                {course?.name || "Untitled Course"}
              </Link>
              <DropDownoptions handleOnDelete={handleOnDelete}>
                <IoEllipsisVerticalOutline className="text-gray-500 hover:text-white transition-colors" />
              </DropDownoptions>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded w-fit">
              {course?.category || "Uncategorized"}
            </p>
          </div>

          <div className="mt-4 flex gap-2 items-center justify-between">
            <h2 className="flex gap-1 items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded">
              <IoBookOutline />
              {numberOfChapters} Chapters
            </h2>
            <h2 className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded px-2 py-1">
              {level}
            </h2>
          </div>

          <div className="flex gap-2 items-center mt-3 border-t border-gray-100 dark:border-gray-800 pt-3">
            {course?.userProfileImage ? (
              <Image
                src={course.userProfileImage}
                width={25}
                height={25}
                alt="User Profile"
                className="rounded-full"
                loading="lazy"
              />
            ) : (
              <div className="w-[25px] h-[25px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs">
                {course?.userName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <h2 className="text-xs text-gray-500">{course.userName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;