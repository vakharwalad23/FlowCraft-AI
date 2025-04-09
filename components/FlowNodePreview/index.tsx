"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Mail,
  Bell,
  User,
  Settings,
  LogIn,
  Home,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowNodePreviewProps {
  title: string;
  description: string;
  components: string[];
}

export function FlowNodePreview({
  title,
  description,
  components,
}: FlowNodePreviewProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to render the appropriate component preview
  const renderComponent = (componentName: string) => {
    switch (componentName.toLowerCase()) {
      case "search input":
        return (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
        );
      case "navigation menu":
      case "navbar":
        return (
          <nav className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-6">
              <Home className="h-5 w-5 text-cyan-400" />
              <Button variant="ghost" className="text-slate-200">
                Features
              </Button>
              <Button variant="ghost" className="text-slate-200">
                Pricing
              </Button>
              <Button variant="ghost" className="text-slate-200">
                About
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-slate-200" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-slate-200" />
              </Button>
            </div>
          </nav>
        );
      case "hero section":
      case "welcome banner":
        return (
          <div className="text-center space-y-4 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-slate-300 max-w-lg mx-auto">{description}</p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-200">
                Learn More
              </Button>
            </div>
          </div>
        );
      case "login form":
      case "auth form":
        return (
          <form className="space-y-4 p-6 bg-slate-800 rounded-lg">
            <div className="space-y-2">
              <Label className="text-slate-200">Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-200">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>
        );
      case "mobile menu":
        return (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-slate-200" />
              ) : (
                <Menu className="h-5 w-5 text-slate-200" />
              )}
            </Button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700">
                <Button variant="ghost" className="w-full justify-start px-4 text-slate-200">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="ghost" className="w-full justify-start px-4 text-slate-200">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start px-4 text-slate-200">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="p-4 border border-slate-700 rounded-lg bg-slate-800">
            <p className="text-slate-300">{componentName} Preview</p>
          </div>
        );
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-slate-900/90 border-slate-800">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-slate-100">{title} Preview</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="space-y-4">
        {components.map((component, index) => (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-medium text-cyan-400">
              {component}
            </Label>
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </Card>
  );
} 