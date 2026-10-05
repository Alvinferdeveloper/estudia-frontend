"use client"

import * as React from "react"
import { Moon, Sun, User, Settings, LogOut, CreditCard, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

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
import { useRouter } from "@/i18n/navigation"
import { useUsage } from "@/app/[locale]/subscription/hooks/useSubscription"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/config/routes"
import { LocaleSubmenu } from "@/components/locale/LocaleSubmenu"

export function UserProfileMenu() {
    const t = useTranslations("common");
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
                    router.push(ROUTES.home);
                }
            }
        });
    }

    const planColors: Record<string, string> = {
        free: "bg-muted text-muted-foreground",
        basic: "bg-info text-info-foreground",
        pro: "bg-primary text-primary-foreground",
        enterprise: "bg-warning text-warning-foreground",
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="press-feedback relative cursor-pointer h-10 w-10 rounded-full p-0 overflow-hidden border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image || undefined} alt={t("userMenu.avatarAlt")} />
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
                                    {t("userMenu.currentPlan")}
                                </span>
                                <span className={cn("text-xs px-2 py-0.5 rounded-full", planColors[usage.plan])}>
                                    {t(`plans.${usage.plan}`)}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{t("userMenu.aiChat")}</span>
                                    <span>{usage.chat.used}/{usage.chat.limit}</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${Math.min(100, (usage.chat.used / usage.chat.limit) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">{t("userMenu.aiNotes")}</span>
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(ROUTES.subscription)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>{t("userMenu.upgradePlan")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("userMenu.profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("userMenu.settings")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>{t("theme.label")}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                                {t("theme.light")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                                {t("theme.dark")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                                {t("theme.system")}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <LocaleSubmenu />
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("userMenu.logOut")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
