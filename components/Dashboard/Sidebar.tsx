import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Folder, LogOut, Clock, Workflow } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({
  className,
  activeTab = "all",
  onTabChange,
}: SidebarProps) {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from the API endpoint
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/me");

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Fall back to default user data if API fails
          console.error("Failed to fetch user data:", await response.text());
          setUser({
            name: "User",
            email: "user@example.com",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Fallback user data
        setUser({
          name: "User",
          email: "user@example.com",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div
      className={cn(
        "w-56 sm:w-64 h-screen bg-black/50 border-r border-zinc-700/90 flex flex-col",
        className
      )}
    >
      {/* User profile */}
      <div className="p-3 sm:p-4 border-b border-zinc-700/90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : user?.name ? (
              getInitials(user.name)
            ) : (
              "?"
            )}
          </div>
          <div className="overflow-hidden">
            {isLoading ? (
              <>
                {/* Skeleton for name */}
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse mb-1" />
                {/* Skeleton for email */}
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
              </>
            ) : (
              <>
                <h3 className="text-xs sm:text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </h3>
                <p className="text-xs text-zinc-400 truncate text-[10px] sm:text-xs">
                  {user?.email || "user@example.com"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-3 sm:py-4 px-2 sm:px-3 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
          onClick={() => router.push("/")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>

        {/* Tab navigation buttons */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-zinc-300 hover:text-white hover:bg-black/70 text-xs sm:text-sm focus:ring-0 focus:outline-none",
            activeTab === "all" && "bg-purple-500/60 text-white"
          )}
          onClick={() => handleTabChange("all")}
        >
          <Workflow className="mr-2 h-4 w-4" />
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-zinc-300 hover:text-white hover:bg-black/70 text-xs sm:text-sm focus:ring-0 focus:outline-none",
            activeTab === "unorganized" && "bg-purple-500/60 text-white"
          )}
          onClick={() => handleTabChange("unorganized")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Unorganized
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-zinc-300 hover:text-white hover:bg-black/70 text-xs sm:text-sm focus:ring-0 focus:outline-none",
            activeTab === "folders" && "bg-purple-500/60 text-white"
          )}
          onClick={() => handleTabChange("folders")}
        >
          <Folder className="mr-2 h-4 w-4" />
          Folders
        </Button>
      </div>

      {/* Logout button */}
      <div className="p-3 sm:p-4 border-t border-zinc-700/90 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
