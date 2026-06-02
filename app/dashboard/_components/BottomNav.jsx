"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { cn } from '../../../lib/utils';

function BottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const Menu = [
        {
            id: 1,
            title: "Home",
            icon: <FaHome size={22} />,
            path: "/dashboard",
        },
        {
            id: 2,
            title: "Explore",
            icon: <BsStack size={22} />,
            path: "/dashboard/explore"
        },
        {
            id: 3,
            title: "Upgrade",
            icon: <IoShieldCheckmark size={22} />,
            path: "/dashboard/upgrade"
        }
    ];

    return (
        <div 
            className="md:hidden fixed bottom-0 left-0 w-full z-[100] glass border-t border-white/10"
            style={{ paddingBottom: 'var(--safe-bottom)' }}
        >
            <div className="flex justify-around items-center h-[68px] px-2">
                {Menu.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link href={item.path} key={item.id} className="flex-1 flex justify-center h-full">
                            <div className="flex flex-col items-center justify-center p-1 relative w-full h-full group">
                                {isActive && (
                                    <div className="absolute top-0 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-b-full shadow-[0_0_15px_rgba(236,72,153,0.8)]"></div>
                                )}
                                <div className={cn(
                                    "transition-all duration-300 transform group-active:scale-95",
                                    isActive ? "text-pink-400 scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)] -translate-y-1" : "text-gray-400 group-hover:text-gray-200"
                                )}>
                                    {item.icon}
                                </div>
                                <span className={cn(
                                    "text-[10px] mt-1 font-medium transition-all duration-300",
                                    isActive ? "text-pink-400 font-bold opacity-100" : "text-gray-500 opacity-80"
                                )}>
                                    {item.title}
                                </span>
                            </div>
                        </Link>
                    )
                })}
                {/* Profile / User Button */}
                <div className="flex-1 flex justify-center items-center h-full cursor-pointer group">
                    <div className="flex flex-col items-center justify-center w-full h-full group-active:scale-95 transition-transform duration-300">
                        <div className="w-[28px] h-[28px] flex items-center justify-center mb-1">
                            {mounted ? (
                                <UserButton 
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-[28px] h-[28px] ring-2 ring-purple-500/50 group-hover:ring-pink-500 transition-all shadow-md",
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-[28px] h-[28px] rounded-full bg-gray-700 animate-pulse"></div>
                            )}
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium opacity-80 group-hover:text-gray-200 transition-all">Profile</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BottomNav
