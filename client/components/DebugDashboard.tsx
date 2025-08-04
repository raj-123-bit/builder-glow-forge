import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bug,
  Activity,
  Database,
  Zap,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePerformanceDashboard } from "@/hooks/useNASPerformanceMonitoring";
import { debugLog } from "@/lib/highlight";

interface DebugLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  data?: any;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

const DebugDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [isRecording, setIsRecording] = useState(true);
  const { getPerformanceSnapshot } = usePerformanceDashboard();

  // Mock performance metrics - in real app, these would come from monitoring
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetric[]
  >([
    {
      name: "Response Time",
      value: 245,
      unit: "ms",
      status: "good",
      trend: "down",
    },
    {
      name: "Memory Usage",
      value: 67,
      unit: "MB",
      status: "warning",
      trend: "up",
    },
    {
      name: "API Calls",
      value: 42,
      unit: "req/min",
      status: "good",
      trend: "stable",
    },
    {
      name: "Error Rate",
      value: 0.5,
      unit: "%",
      status: "good",
      trend: "down",
    },
    {
      name: "NAS Operations",
      value: 15,
      unit: "ops/hr",
      status: "good",
      trend: "up",
    },
  ]);

  // Simulate real-time debug logs
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      const mockLogs: DebugLog[] = [
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Architecture evaluation completed",
          data: { accuracy: 0.89, latency: 23.5 },
        },
        {
          id: `log_${Date.now() + 1}`,
          timestamp: new Date().toISOString(),
          level: "debug",
          message: "Search algorithm iteration #42",
          data: { convergence: 0.75, best_score: 0.91 },
        },
      ];

      // Randomly add a log
      if (Math.random() > 0.7) {
        const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        setDebugLogs((prev) => [randomLog, ...prev.slice(0, 99)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const handleClearLogs = () => {
    setDebugLogs([]);
    debugLog("Debug logs cleared");
  };

  const handleExportLogs = () => {
    const logsJson = JSON.stringify(debugLogs, null, 2);
    const blob = new Blob([logsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nas-debug-logs-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    debugLog("Debug logs exported");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="shadow-lg bg-card/90 backdrop-blur-sm border-primary/20"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40 w-96 max-h-[600px]">
      <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/20 rounded-full">
              <Bug className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Debug Dashboard</CardTitle>
              <p className="text-xs text-muted-foreground">
                Neural Architecture Search Monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge
              variant={isRecording ? "default" : "secondary"}
              className="text-xs"
            >
              {isRecording ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                  Recording
                </>
              ) : (
                "Paused"
              )}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="overview" className="text-xs">
                <Monitor className="h-3 w-3 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Perf
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="flex items-center gap-1 text-green-700 font-medium">
                    <CheckCircle className="h-3 w-3" />
                    System Status
                  </div>
                  <p className="text-green-600 mt-1">Healthy</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                  <div className="flex items-center gap-1 text-blue-700 font-medium">
                    <Zap className="h-3 w-3" />
                    Highlight.io
                  </div>
                  <p className="text-blue-600 mt-1">Connected</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                  <div className="flex items-center gap-1 text-purple-700 font-medium">
                    <Database className="h-3 w-3" />
                    Supabase
                  </div>
                  <p className="text-purple-600 mt-1">Online</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded p-2">
                  <div className="flex items-center gap-1 text-orange-700 font-medium">
                    <Clock className="h-3 w-3" />
                    Uptime
                  </div>
                  <p className="text-orange-600 mt-1">2h 15m</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Activity</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Architecture evaluation completed</span>
                    <span className="text-muted-foreground ml-auto">
                      2m ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Search algorithm started</span>
                    <span className="text-muted-foreground ml-auto">
                      5m ago
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Performance Metrics</h4>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {performanceMetrics.map((metric) => (
                    <div
                      key={metric.name}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs"
                    >
                      <span className="font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-xs",
                            getStatusColor(metric.status),
                          )}
                        >
                          {metric.value} {metric.unit}
                        </Badge>
                        <span className="text-muted-foreground">
                          {getTrendIcon(metric.trend)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    Debug Logs ({debugLogs.length})
                  </h4>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs px-2"
                      onClick={handleExportLogs}
                    >
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs px-2"
                      onClick={handleClearLogs}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-1">
                    {debugLogs.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No logs recorded yet
                      </p>
                    ) : (
                      debugLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 bg-muted/50 rounded text-xs"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                log.level === "error"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {log.level}
                            </Badge>
                            <span className="text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="font-medium">{log.message}</p>
                          {log.data && (
                            <pre className="text-xs text-muted-foreground mt-1 overflow-hidden">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Debug Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Recording</span>
                    <Button
                      size="sm"
                      variant={isRecording ? "default" : "outline"}
                      className="h-6 text-xs px-2"
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? "Stop" : "Start"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Auto-export logs</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2"
                    >
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Session replay</span>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-6 text-xs px-2"
                    >
                      Active
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p>
                    <strong>Built by:</strong> Shaurya Upadhyay
                  </p>
                  <p>
                    <strong>Debug Mode:</strong> Enhanced with Highlight.io +
                    Netlify
                  </p>
                  <p>
                    <strong>Version:</strong> v2.0.0
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugDashboard;
