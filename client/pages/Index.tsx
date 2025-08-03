import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Zap,
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  GitBranch,
  Activity,
  Clock,
  Cpu,
  Database,
  FlaskConical,
  Menu,
} from "lucide-react";

interface Architecture {
  id: string;
  name: string;
  accuracy: number;
  params: string;
  flops: string;
  latency: number;
  score: number;
}

const mockArchitectures: Architecture[] = [
  {
    id: "1",
    name: "EfficientNet-B7",
    accuracy: 94.8,
    params: "66M",
    flops: "37.1G",
    latency: 14.2,
    score: 87.3,
  },
  {
    id: "2",
    name: "ResNet-152",
    accuracy: 93.2,
    params: "60M",
    flops: "11.6G",
    latency: 8.1,
    score: 85.1,
  },
  {
    id: "3",
    name: "MobileNetV3-Large",
    accuracy: 91.7,
    params: "5.4M",
    flops: "219M",
    latency: 2.3,
    score: 92.4,
  },
];

export default function Index() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState("imagenet");
  const [searchStrategy, setSearchStrategy] = useState("evolutionary");

  const startSearch = () => {
    setIsSearching(true);
    setSearchProgress(0);

    const interval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSearching(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NeuralArchSearch</h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Architecture Discovery
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/experiments"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Experiments
                </Link>
                <Link
                  to="/datasets"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Datasets
                </Link>
              </nav>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Activity className="h-3 w-3 mr-1" />
                Beta v2.1
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Configuration */}
          <div className="lg:col-span-1">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Search Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="dataset">Target Dataset</Label>
                  <Select
                    value={selectedDataset}
                    onValueChange={setSelectedDataset}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imagenet">ImageNet-1K</SelectItem>
                      <SelectItem value="cifar10">CIFAR-10</SelectItem>
                      <SelectItem value="cifar100">CIFAR-100</SelectItem>
                      <SelectItem value="custom">Custom Dataset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strategy">Search Strategy</Label>
                  <Select
                    value={searchStrategy}
                    onValueChange={setSearchStrategy}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evolutionary">
                        Evolutionary Search
                      </SelectItem>
                      <SelectItem value="reinforcement">
                        Reinforcement Learning
                      </SelectItem>
                      <SelectItem value="gradient">Gradient-based</SelectItem>
                      <SelectItem value="bayesian">
                        Bayesian Optimization
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Search Budget</Label>
                    <Input id="budget" placeholder="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="population">Population Size</Label>
                    <Input id="population" placeholder="50" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={startSearch}
                    disabled={isSearching}
                    className="flex-1"
                  >
                    {isSearching ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Search
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {isSearching && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(searchProgress)}%</span>
                    </div>
                    <Progress value={searchProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Stats */}
            <Card className="mt-6 border-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Search Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">247</div>
                    <div className="text-sm text-muted-foreground">
                      Architectures Tested
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">94.8%</div>
                    <div className="text-sm text-muted-foreground">
                      Best Accuracy
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Search Time
                    </span>
                    <span className="text-sm">2h 14m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      GPU Hours
                    </span>
                    <span className="text-sm">8.7h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Convergence
                    </span>
                    <span className="text-sm text-primary">Stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results & Visualization */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Architecture Results</TabsTrigger>
                <TabsTrigger value="visualization">Search Space</TabsTrigger>
                <TabsTrigger value="analysis">Performance Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Top Architectures</h3>
                  <Badge variant="outline" className="text-primary">
                    {mockArchitectures.length} Found
                  </Badge>
                </div>

                <div className="space-y-4">
                  {mockArchitectures.map((arch, index) => (
                    <Card
                      key={arch.id}
                      className="border-border bg-card/50 hover:bg-card/80 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                              <GitBranch className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{arch.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Rank #{index + 1}</span>
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/20 text-primary"
                                >
                                  Score: {arch.score}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Link to={`/architecture/${arch.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">
                                {arch.accuracy}%
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Accuracy
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">
                                {arch.params}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Parameters
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">
                                {arch.flops}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                FLOPs
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-medium">
                                {arch.latency}ms
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Latency
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="visualization" className="space-y-4">
                <Card className="border-border bg-card/50">
                  <CardHeader>
                    <CardTitle>Search Space Exploration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Interactive Visualization
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          Explore the neural architecture search space with
                          interactive plots showing accuracy vs efficiency
                          trade-offs, architecture similarities, and search
                          progression.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-border bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Pareto Frontier
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Accuracy vs Efficiency
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Search Convergence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Performance Over Time
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
