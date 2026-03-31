"use client"

import * as React from "react"
import { Moon, Sun, User, Settings, LogOut, CreditCard, Zap } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/app/hooks/useAuth"
import { authClient } from "@/app/lib/auth-client"
import { useRouter } from "next/navigation"
import { useUsage } from "@/app/subscription/hooks/useSubscription"
import { cn } from "@/lib/utils"

export function UserProfileMenu() {
    const { setTheme } = useTheme();
    const { data: session, } = useAuth();
    const { data: usage } = useUsage();
    const router = useRouter();

    const getInitials = (name = 'U') => {
        return name.split(" ").map((n) => n[0]).join("");
    }

    const handleLogOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                }
            }
        });
    }

    const planColors: Record<string, string> = {
        free: "bg-gray-500",
        basic: "bg-blue-500",
        pro: "bg-purple-500",
        enterprise: "bg-orange-500",
    };

    const planNames: Record<string, string> = {
        free: "Free",
        basic: "Basic",
        pro: "Pro",
        enterprise: "Enterprise",
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative cursor-pointer h-10 w-10 rounded-full p-0 overflow-hidden border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image || undefined} alt="Usuario" />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials(session?.user?.name)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={10}>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {session?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                
                {usage && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Current Plan
                                </span>
                                <span className={cn("text-xs text-white px-2 py-0.5 rounded-full", planColors[usage.plan])}>
                                    {planNames[usage.plan]}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">AI Chat</span>
                                    <span>{usage.chat.used}/{usage.chat.limit}</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${Math.min(100, (usage.chat.used / usage.chat.limit) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">AI Notes</span>
                                    <span>{usage.aiNotes.used}/{usage.aiNotes.limit}</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${Math.min(100, (usage.aiNotes.used / usage.aiNotes.limit) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/subscription")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Upgrade Plan</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                                System
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
