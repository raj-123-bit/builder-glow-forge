import React from "react";
import PlaceholderPage from "@/components/PlaceholderPage";
import { Database } from "lucide-react";

export default function Datasets() {
  return (
    <PlaceholderPage
      title="Dataset Management"
      description="Upload, manage, and configure datasets for neural architecture search. Support for ImageNet, CIFAR, custom datasets, and data preprocessing pipelines."
      icon={<Database className="h-12 w-12 text-primary" />}
    />
  );
}
