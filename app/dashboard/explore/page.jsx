"use client";
import React, { useEffect, useState, useCallback } from "react";
import CourseCard from "../_components/CourseCard";

// Skeleton card for loading state
function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl glass border border-white/10 overflow-hidden animate-pulse">
      <div className="h-[180px] bg-white/5 w-full" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-5 w-2/3 rounded-lg bg-white/10" />
          <div className="h-5 w-5 rounded bg-white/10" />
        </div>
        <div className="h-4 w-1/3 rounded bg-white/10" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-24 rounded bg-white/10" />
          <div className="h-6 w-20 rounded bg-white/10" />
        </div>
        <div className="flex gap-2 items-center pt-3 border-t border-white/5">
          <div className="w-6 h-6 rounded-full bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const GetAllCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/courses/explore?pageIndex=${pageIndex}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const res = await response.json();
      setCourseList(res);
      // If fewer than expected results come back, there's no next page
      setHasMore(res.length >= 6);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [pageIndex]);

  useEffect(() => {
    GetAllCourse();
  }, [GetAllCourse]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-black gradient-text">Explore Courses</h2>
          <span className="glass px-3 py-1 rounded-full text-xs font-bold text-purple-300 border border-white/10">
            Community
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          Browse AI-generated courses built by the Rverse community
        </p>
        <div className="h-[1px] mt-4 bg-gradient-to-r from-purple-500/30 via-pink-500/20 to-transparent" />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 glass rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-red-300 font-semibold text-sm">Failed to load courses</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={GetAllCourse}
            className="px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeleton loaders */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Course Grid */}
      {!loading && courseList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseList.map((course, index) => (
            <CourseCard
              course={course}
              key={course.courseId || index}
              displayUser={true}
              priority={index === 0}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && courseList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl border border-white/10">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No courses yet</h3>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Be the first to generate and share a course with the community!
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && courseList.length > 0 && (
        <div className="flex justify-between items-center mt-8 gap-4">
          <button
            onClick={() => setPageIndex((prev) => prev - 1)}
            disabled={pageIndex === 0 || loading}
            className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
          >
            ← Previous
          </button>
          <span className="text-gray-500 text-sm font-medium px-2">
            Page {pageIndex + 1}
          </span>
          <button
            onClick={() => setPageIndex((prev) => prev + 1)}
            disabled={!hasMore || loading}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Explore;
