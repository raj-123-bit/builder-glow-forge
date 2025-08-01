import PlaceholderPage from "@/components/PlaceholderPage";
import { FlaskConical } from "lucide-react";

export default function Experiments() {
  return (
    <PlaceholderPage
      title="Experiment Management"
      description="Track and manage your neural architecture search experiments, compare results, and analyze performance across different configurations."
      icon={<FlaskConical className="h-12 w-12 text-primary" />}
    />
  );
}
