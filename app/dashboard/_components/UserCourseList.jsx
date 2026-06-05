"use client";

import React, { useEffect, useState, useContext, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import CourseCard from "./CourseCard";
import UserCourseListContext from "../../_context/UserCourseListContext";

// ✅ Skeleton card shown while courses are loading — prevents blank-flash UI
function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl glass border border-white/10 overflow-hidden animate-pulse">
      {/* Banner placeholder */}
      <div className="h-[200px] bg-white/5 w-full" />
      <div className="p-4 flex flex-col gap-3">
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-2/3 rounded-lg bg-white/10" />
          <div className="h-5 w-5 rounded bg-white/10" />
        </div>
        {/* Category badge */}
        <div className="h-4 w-1/3 rounded bg-white/10" />
        {/* Stats row */}
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-24 rounded bg-white/10" />
          <div className="h-6 w-20 rounded bg-white/10" />
        </div>
        {/* User row */}
        <div className="flex gap-2 items-center pt-3 border-t border-white/5">
          <div className="w-6 h-6 rounded-full bg-white/10" />
          <div className="h-3 w-20 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function UserCourseList() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setUserCourseList } = useContext(UserCourseListContext);

  const fetchUserCourses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/courses", {
        headers: {
          "x-user-email": user?.primaryEmailAddress?.emailAddress,
          "x-user-id": user?.id,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch courses");
      }

      const res = await response.json();
      setUserCourseList(res);

      const parsedCourses = res.map((c) => ({
        ...c,
        courseOutput: { course: { numberOfChapters: Number(c.noOfChapters) || 0 } },
        courseBanner:
          c.courseBanner ||
          "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
      }));

      setCourses(parsedCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, [user, setUserCourseList]);

  useEffect(() => {
    if (user) fetchUserCourses();
  }, [user, fetchUserCourses]);

  return (
    <div className="mt-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black gradient-text">Your Courses</h2>
          <p className="text-gray-500 text-sm mt-1">
            {loading
              ? "Loading your courses..."
              : `${courses.length} course${courses.length !== 1 ? "s" : ""} generated`}
          </p>
        </div>
        <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-purple-500/30 to-transparent" />
        <div className="glass px-4 py-2 rounded-xl border border-white/10 text-sm font-semibold text-gray-400">
          History
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 glass rounded-2xl border border-red-500/30 bg-red-500/5 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-red-300 font-semibold text-sm">Failed to load courses</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchUserCourses}
            className="ml-auto px-4 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ✅ Skeleton grid shown while fetching */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Course Cards */}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <CourseCard
              course={course}
              key={course.courseId}
              refreshData={fetchUserCourses}
              // ✅ First card loads eagerly (above the fold), rest are lazy
              priority={idx === 0}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No courses yet</h3>
          <p className="text-gray-500 text-sm mb-6 text-center max-w-xs">
            Generate your first AI-powered course and it will appear here
          </p>
          <Link
            href="/create-course"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:scale-105 hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all"
          >
            + Create First Course
          </Link>
        </div>
      )}
    </div>
  );
}

export default UserCourseList;
