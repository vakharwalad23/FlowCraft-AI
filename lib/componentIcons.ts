import {
  Search,
  Square,
  ListChecks,
  Image as ImageIcon,
  FormInput,
  Grid3x3,
  Layout,
  Type,
  Calendar,
  Map,
  MessageSquare,
  Upload,
  Table,
  BarChart,
  SlidersHorizontal,
  Menu,
  User,
  Mail,
  Lock,
  CreditCard,
  Share2,
  Bell,
  Tag,
  Layers,
  LucideIcon,
} from "lucide-react";

interface ComponentIconMapping {
  [key: string]: {
    icon: LucideIcon;
    color: string;
  };
}

export const componentIcons: ComponentIconMapping = {
  // Input Components
  "Search Input": { icon: Search, color: "text-blue-400" },
  "Text Input": { icon: FormInput, color: "text-indigo-400" },
  "Form Field": { icon: FormInput, color: "text-violet-400" },
  
  // Button Components
  "Action Button": { icon: Square, color: "text-cyan-400" },
  "Submit Button": { icon: Square, color: "text-teal-400" },
  "CTA Button": { icon: Square, color: "text-emerald-400" },
  
  // Layout Components
  "Card Grid": { icon: Grid3x3, color: "text-pink-400" },
  "Hero Section": { icon: Layout, color: "text-rose-400" },
  "Image Gallery": { icon: ImageIcon, color: "text-orange-400" },
  
  // Navigation Components
  "Navigation Menu": { icon: Menu, color: "text-yellow-400" },
  "Breadcrumb": { icon: ListChecks, color: "text-lime-400" },
  
  // Typography Components
  "Heading": { icon: Type, color: "text-green-400" },
  "Text Block": { icon: Type, color: "text-emerald-400" },
  
  // Interactive Components
  "Calendar Picker": { icon: Calendar, color: "text-sky-400" },
  "Map View": { icon: Map, color: "text-blue-400" },
  "Chat Interface": { icon: MessageSquare, color: "text-indigo-400" },
  
  // Data Display
  "Data Table": { icon: Table, color: "text-violet-400" },
  "Chart": { icon: BarChart, color: "text-purple-400" },
  "Statistics": { icon: BarChart, color: "text-fuchsia-400" },
  
  // User Interface
  "Settings Panel": { icon: SlidersHorizontal, color: "text-pink-400" },
  "User Profile": { icon: User, color: "text-rose-400" },
  "Contact Form": { icon: Mail, color: "text-red-400" },
  
  // Authentication
  "Login Form": { icon: Lock, color: "text-orange-400" },
  "Password Input": { icon: Lock, color: "text-amber-400" },
  
  // E-commerce
  "Payment Form": { icon: CreditCard, color: "text-yellow-400" },
  "Product Card": { icon: Tag, color: "text-lime-400" },
  
  // Social
  "Share Button": { icon: Share2, color: "text-green-400" },
  "Notification": { icon: Bell, color: "text-emerald-400" },
  
  // File Handling
  "File Upload": { icon: Upload, color: "text-teal-400" },
  
  // Default
  "Component": { icon: Layers, color: "text-slate-400" },
};

export const getComponentIcon = (componentName: string) => {
  // Try to find an exact match
  let iconConfig = componentIcons[componentName];
  
  if (!iconConfig) {
    // Try to find a partial match
    const key = Object.keys(componentIcons).find(k => 
      componentName.toLowerCase().includes(k.toLowerCase())
    );
    iconConfig = key ? componentIcons[key] : componentIcons["Component"];
  }
  
  return iconConfig;
}; 