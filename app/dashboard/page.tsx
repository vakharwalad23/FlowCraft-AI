// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Search } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { DashboardTabs } from "@/components/Dashboard/DashboardTabs"
// import { ActionCards } from "@/components/Dashboard/ActionCards"
// import { FilesTable } from "@/components/Dashboard/FilesTable"

// export type File = {
//   id: number
//   name: string
//   location: string
//   created: string
//   edited: string
//   comments: number
// }

// const SAMPLE_FILES: File[] = [
//   {
//     id: 1,
//     name: "App",
//     location: "India",
//     created: "2 months ago",
//     edited: "2 months ago",
//     comments: 0,
//   },
//   {
//     id: 2,
//     name: "Marketing Plan",
//     location: "Projects",
//     created: "1 week ago",
//     edited: "3 days ago",
//     comments: 5,
//   },
//   {
//     id: 3,
//     name: "Budget 2024",
//     location: "Finance",
//     created: "1 month ago",
//     edited: "2 weeks ago",
//     comments: 2,
//   },
//   {
//     id: 4,
//     name: "Product Roadmap",
//     location: "Strategy",
//     created: "3 months ago",
//     edited: "1 month ago",
//     comments: 8,
//   },
// ]

// export default function Dashboard() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
//   const searchInputRef = useRef<HTMLInputElement | null>(null)
//   const [files, setFiles] = useState<File[]>(SAMPLE_FILES)

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.ctrlKey && event.key === "k") {
//         event.preventDefault()
//         searchInputRef.current?.focus()
//       }
//     }

//     const handleMouseMove = (event: MouseEvent) => {
//       setMousePosition({ x: event.clientX, y: event.clientY })
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     window.addEventListener("mousemove", handleMouseMove)

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown)
//       window.removeEventListener("mousemove", handleMouseMove)
//     }
//   }, [])

//   const filteredFiles = files.filter(
//     (file) =>
//       file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       file.location.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white relative overflow-hidden">
//       {/* Other Background Options for matching the Vibe of the Website */}
//     {/* <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white relative overflow-hidden"> */}

//       <div className="container mx-auto p-4 relative z-10">
//         <div className="flex items-center justify-between mb-6">
//           <DashboardTabs />

//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
//               <Input
//                 ref={searchInputRef}
//                 type="search"
//                 placeholder="Search"
//                 className="w-64 pl-8 bg-gray-800/50 backdrop-blur-md border-gray-700/50 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-all"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <span className="absolute right-2.5 top-2.5 text-xs text-gray-400">Ctrl + K</span>
//             </div>
//           </div>
//         </div>

//         <ActionCards />
//         <FilesTable files={filteredFiles} />
//       </div>
//     </div>
//   )
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardTabs } from "@/components/Dashboard/DashboardTabs";
import { ActionCards } from "@/components/Dashboard/ActionCards";
import { FilesTable } from "@/components/Dashboard/FilesTable";
import { CreativeBackground } from "@/components/Dashboard/CreativeBackground";

export type File = {
  id: number;
  name: string;
  location: string;
  created: string;
  edited: string;
  comments: number;
};

// TODO: Remove this and use the actual files from the local storage
const SAMPLE_FILES: File[] = [
  {
    id: 1,
    name: "App",
    location: "India",
    created: "2 months ago",
    edited: "2 months ago",
    comments: 0,
  },
  {
    id: 2,
    name: "Marketing Plan",
    location: "Projects",
    created: "1 week ago",
    edited: "3 days ago",
    comments: 5,
  },
  {
    id: 3,
    name: "Budget 2024",
    location: "Finance",
    created: "1 month ago",
    edited: "2 weeks ago",
    comments: 2,
  },
  {
    id: 4,
    name: "Product Roadmap",
    location: "Strategy",
    created: "3 months ago",
    edited: "1 month ago",
    comments: 8,
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>(SAMPLE_FILES);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      <div className="container mx-auto p-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <DashboardTabs />

          <div className="flex items-center gap-2 border border-zinc-700/50 rounded-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search"
                className="w-64 pl-8 bg-zinc-800/50 focus:outline-none focus:ring-0 focus:border-0 border-zinc-700/50 text-white rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-2.5 top-2.5 text-xs text-gray-400">
                Ctrl + K
              </span>
            </div>
          </div>
        </div>

        <ActionCards />
        <FilesTable files={filteredFiles} />
      </div>
    </div>
  );
}
