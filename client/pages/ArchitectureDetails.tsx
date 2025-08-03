import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Brain,
  Target,
  Database,
  Cpu,
  Clock,
  Zap,
  GitBranch,
  Download,
  Share,
  Play,
} from "lucide-react";

const architectureData = {
  "1": {
    name: "EfficientNet-B7",
    accuracy: 94.8,
    params: "66M",
    flops: "37.1G",
    latency: 14.2,
    score: 87.3,
    description:
      "Compound scaled CNN architecture optimized for efficiency and accuracy trade-off",
    layers: [
      { type: "Conv2D", filters: 32, kernel: "3x3", stride: 2 },
      { type: "MBConv", filters: 16, kernel: "3x3", stride: 1, expand: 1 },
      { type: "MBConv", filters: 24, kernel: "3x3", stride: 2, expand: 6 },
      { type: "MBConv", filters: 40, kernel: "5x5", stride: 2, expand: 6 },
      { type: "MBConv", filters: 80, kernel: "3x3", stride: 2, expand: 6 },
      { type: "MBConv", filters: 112, kernel: "5x5", stride: 1, expand: 6 },
      { type: "MBConv", filters: 192, kernel: "5x5", stride: 2, expand: 6 },
      { type: "MBConv", filters: 320, kernel: "3x3", stride: 1, expand: 6 },
      { type: "Conv2D", filters: 1280, kernel: "1x1", stride: 1 },
      { type: "GlobalAvgPool" },
      { type: "Dense", units: 1000 },
    ],
  },
};

export default function ArchitectureDetails() {
  const { id } = useParams();
  const architecture = architectureData[id as keyof typeof architectureData];

  if (!architecture) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Architecture Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested architecture could not be found.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{architecture.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    Neural Architecture Details
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-3">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                {architecture.accuracy}%
              </div>
              <div className="text-sm text-muted-foreground">
                Top-1 Accuracy
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-3">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                {architecture.params}
              </div>
              <div className="text-sm text-muted-foreground">Parameters</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-3">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                {architecture.flops}
              </div>
              <div className="text-sm text-muted-foreground">FLOPs</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                {architecture.latency}ms
              </div>
              <div className="text-sm text-muted-foreground">
                Inference Time
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Architecture Details */}
        <Tabs defaultValue="architecture" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Architecture Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {architecture.description}
                </p>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Layer Structure
                  </h4>

                  <div className="space-y-2">
                    {architecture.layers.map((layer, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            L{index + 1}
                          </Badge>
                          <span className="font-medium">{layer.type}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {layer.filters && (
                            <span>Filters: {layer.filters}</span>
                          )}
                          {layer.kernel && <span>Kernel: {layer.kernel}</span>}
                          {layer.stride && <span>Stride: {layer.stride}</span>}
                          {layer.expand && <span>Expand: {layer.expand}x</span>}
                          {layer.units && <span>Units: {layer.units}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle>Accuracy Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Top-1 Accuracy</span>
                      <span className="font-semibold">
                        {architecture.accuracy}%
                      </span>
                    </div>
                    <Progress value={architecture.accuracy} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Top-5 Accuracy</span>
                      <span className="font-semibold">97.2%</span>
                    </div>
                    <Progress value={97.2} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Validation Loss</span>
                      <span className="font-semibold">0.184</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle>Efficiency Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {architecture.score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Overall Score
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-primary">4.2</div>
                      <div className="text-xs text-muted-foreground">
                        Efficiency Ratio
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>2.8 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Training Time</span>
                      <span>48h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Energy Consumption</span>
                      <span>142 kWh</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Architecture Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Performance Visualization
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      Interactive charts showing layer-wise analysis, gradient
                      flow, feature map visualizations, and performance
                      comparisons.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Implementation Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-muted-foreground">
                    {`import torch
import torch.nn as nn
from torchvision.models import efficientnet_b7

class EfficientNetB7(nn.Module):
    def __init__(self, num_classes=1000):
        super(EfficientNetB7, self).__init__()
        self.backbone = efficientnet_b7(pretrained=True)
        self.backbone.classifier = nn.Linear(
            self.backbone.classifier.in_features, 
            num_classes
        )
    
    def forward(self, x):
        return self.backbone(x)

# Model instantiation
model = EfficientNetB7(num_classes=1000)
print(f"Total parameters: {sum(p.numel() for p in model.parameters())}")`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
