import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Folder, LogOut, Layers, Clock } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    image?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Fetch user data from the new API endpoint
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

  return (
    <div
      className={cn(
        "w-64 h-screen bg-black border-r border-zinc-800/50 flex flex-col",
        className
      )}
    >
      {/* User profile */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-medium">
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : user?.name ? (
              getInitials(user.name)
            ) : (
              "?"
            )}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium text-white truncate">
              {isLoading ? (
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
              ) : (
                user?.name || "User"
              )}
            </h3>
            <p className="text-xs text-zinc-400 truncate">
              {isLoading ? (
                <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse mt-1" />
              ) : (
                user?.email || "user@example.com"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
          onClick={() => router.push("/dashboard")}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50",
            pathname === "/dashboard" && "bg-zinc-800/70 text-white"
          )}
          onClick={() => router.push("/dashboard?tab=all")}
        >
          <Layers className="mr-2 h-4 w-4" />
          All Flows
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
          onClick={() => router.push("/dashboard?tab=unorganized")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Unorganized Flows
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
          onClick={() => router.push("/dashboard?tab=folders")}
        >
          <Folder className="mr-2 h-4 w-4" />
          Folders
        </Button>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-zinc-800/50">
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
