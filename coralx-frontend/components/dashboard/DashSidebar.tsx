import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseconfig";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  GraduationCap,
  Newspaper,
  Bell,
  Settings,
  User,
  Wallet,
  TrendingUp,
  History,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

// Avatar placeholder - replace with actual avatar component as needed
const Avatar = () => (
  <div className="h-10 w-10 rounded-full bg-sidebar-primary/20 border border-sidebar-primary/30 flex items-center justify-center overflow-hidden">
    <User className="h-5 w-5 text-sidebar-primary" />
  </div>
);

interface SidebarProps {
  className?: string;
  onCollapseChange?: (value: boolean) => void;
  userRole: "student" | "instructor" |"admin";
}


const Sidebar = ({ className, onCollapseChange, userRole }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const router = useRouter(); //router
  

  useEffect(() => {
    setMounted(true);
    // Default to collapsed on mobile
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setCollapsed(true);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    if (onCollapseChange) onCollapseChange(newValue);
  };

  const navItems =
  userRole === "instructor"
    ? [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: BookOpen,
          active: pathname === "/dashboard",
        },
        {
          name: "Analytics",
          path: "/analytics",
          icon: BarChart3,
          active: pathname === "/analytics",
        },
      ]
    : [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: BookOpen,
          active: pathname === "/dashboard",
        },
        {
          name: "Courses",
          path: "/courses",
          icon: GraduationCap,
          active: pathname === "/courses",
        },
      ];
// {
    //   name: "Home",
    //   path: "/",
    //   icon: Home,
    //   active: pathname === "/",
    // },

  // Don't render anything during first mount to avoid layout shifts
  if (!mounted) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 animate-fade-in backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-50 flex flex-col sidebar-gradient border-r border-sidebar-border/30",
          collapsed ? "w-14" : "w-44",
          isMobile && collapsed ? "translate-x-[-100%]" : "translate-x-0",
          "transition-all duration-300 ease-in-out",
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="h-[10vh] px-4 flex items-center border-b border-sidebar-border/30">
          {!collapsed && (
            <Link href="/" className="flex items-center h-full">
              <Image
                src={"/images/LearnXLogo.png"}
                alt="Link-X Logo"
                width={288}
                height={197}
                className="max-h-[9vh] w-auto object-contain"
                priority
              />
            </Link>
          )}

          <div className={cn("ml-auto", collapsed && "mx-auto")}>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full h-8 w-8 min-w-[2rem] bg-sidebar-accent border-sidebar-border/50 hover:bg-sidebar-primary/20 hover:text-sidebar-primary transition-all"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-2 hide-scrollbar">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <TooltipProvider
                key={item.path}
                delayDuration={collapsed ? 200 : 1000}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center py-2 px-2 rounded-md sidebar-item-hover group",
                        item.active
                          ? "sidebar-active-item text-sidebar-primary"
                          : "text-sidebar-foreground/70"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          item.active
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground/90"
                        )}
                      />

                      {!collapsed && (
                        <span
                          className={cn(
                            "ml-2 text-sm font-medium truncate transition-all",
                            item.active
                              ? ""
                              : "group-hover:text-sidebar-foreground/90"
                          )}
                        >
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent
                      side="right"
                      className="bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
                    >
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="px-2 pt-4 pb-2 border-t border-sidebar-border/30">
          <div className="flex flex-col gap-3">
            {/* Settings */}
            <Link href="/settings" passHref>
              <Button
                variant="outline"
                size={collapsed ? "icon" : "default"}
                className={cn(
                  "w-full bg-sidebar-accent hover:bg-sidebar-accent/70 border-sidebar-border/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                  collapsed ? "justify-center" : "justify-start"
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-2 text-sm">Settings</span>}
              </Button>
            </Link>

            {/* Sign Out */}
            <Button
              variant="outline"
              size={collapsed ? "icon" : "default"}
              onClick={async () => {
                try {
                  await signOut(auth);
                  router.push("/");
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
              className={cn(
                "w-full bg-sidebar-accent hover:bg-sidebar-accent/70 border-sidebar-border/50 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-2 text-sm">Sign out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Toggle button that appears on mobile when sidebar is collapsed */}
      {isMobile && collapsed && (
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg border border-blue-400/30"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default Sidebar;
