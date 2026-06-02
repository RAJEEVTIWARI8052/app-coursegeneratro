"use client"
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'
import BottomNav from './_components/BottomNav'
import BubbleEffect from './_components/BubbleEffect'
import UserCourseListContext from '../_context/UserCourseListContext'
import React, { useState } from 'react'

export default function DashboardLayout({ children }) {
  const [userCourseList, setUserCourseList] = useState([])

  return (
    <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
      <div className="flex h-screen overflow-hidden" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(88,28,135,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(219,39,119,0.1) 0%, transparent 60%), #060612" }}>
        {/* Ambient glow orbs & Bubbles */}
        <div className="fixed top-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-200px] right-[-100px] w-[400px] h-[400px] rounded-full bg-pink-900/15 blur-[100px] pointer-events-none z-0" />
        <BubbleEffect />

        {/* Desktop Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block relative z-10">
          <Sidebar />
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(88px+var(--safe-bottom))] md:pb-6">
            <div className="md:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </UserCourseListContext.Provider>
  )
}