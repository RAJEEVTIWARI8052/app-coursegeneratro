"use client";

import React, { useEffect, useState } from 'react';
import { UserButton } from "@clerk/nextjs";

function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className="flex justify-between p-4 md:p-5 shadow-sm border-b border-white/10 glass items-center sticky top-0 z-40"
      style={{ paddingTop: 'max(var(--safe-top, 0px), 16px)' }}
    >
      <div className="flex items-center gap-2">
        <h1 className="md:hidden text-2xl font-black gradient-text tracking-wide drop-shadow-md">Rverse</h1>
        {/* Placeholder for Breadcrumbs or Welcome text on Desktop */}
      </div>
      <div className="flex items-center">
        {mounted ? (
          <UserButton 
            appearance={{
                elements: {
                    avatarBox: "w-9 h-9 md:w-10 md:h-10 ring-2 ring-purple-500/50 hover:ring-pink-500 transition-all shadow-md",
                }
            }}
          />
        ) : (
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-700 animate-pulse ring-2 ring-gray-600"></div>
        )}
      </div>
    </div>
  )
}

export default Header