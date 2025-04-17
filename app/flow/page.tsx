import { redirect } from "next/navigation";

export const metadata = {
  title: "AI powered flow generation tool",
  description: "Create and manage your flow diagrams",
  keywords: "flow, diagram, AI, generation, tool",
};

export default function FlowPage() {
  redirect("/flow/new");
}
