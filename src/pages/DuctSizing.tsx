
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FileDown, Calculator, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateDuctSize } from "@/utils/calculators";
import { useToast } from "@/hooks/use-toast";

const DuctSizing = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<"round" | "rectangular">("round");
  const [formData, setFormData] = useState({
    flowRate: 1000, // m³/h
    velocity: 5, // m/s
    aspectRatio: 1.5,
  });
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleAspectRatioChange = (value: number[]) => {
    setFormData({
      ...formData,
      aspectRatio: value[0],
    });
  };

  const handleCalculate = () => {
    const calculationResult = calculateDuctSize(
      formData.flowRate,
      formData.velocity,
      tab,
      formData.aspectRatio
    );
    
    setResult(calculationResult);
    
    toast({
      title: "Calculation Complete",
      description: "Duct sizing calculation has been performed successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your calculation results are being prepared for export.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Duct Sizing Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate optimal duct dimensions based on airflow requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter the required airflow parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="round" onValueChange={(value) => setTab(value as "round" | "rectangular")}>
              <TabsList className="mb-6">
                <TabsTrigger value="round">Round Duct</TabsTrigger>
                <TabsTrigger value="rectangular">Rectangular Duct</TabsTrigger>
              </TabsList>
              
              <TabsContent value="round" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="flowRate">Airflow Rate (m³/h)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The volume of air passing through the duct per hour</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="flowRate"
                      name="flowRate"
                      type="number"
                      value={formData.flowRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="velocity">Air Velocity (m/s)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Recommended: 3-8 m/s for main ducts, 2-5 m/s for branches</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="velocity"
                      name="velocity"
                      type="number"
                      value={formData.velocity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rectangular" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="flowRate">Airflow Rate (m³/h)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The volume of air passing through the duct per hour</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="flowRate"
                      name="flowRate"
                      type="number"
                      value={formData.flowRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="velocity">Air Velocity (m/s)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Recommended: 3-8 m/s for main ducts, 2-5 m/s for branches</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="velocity"
                      name="velocity"
                      type="number"
                      value={formData.velocity}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="aspectRatio">Aspect Ratio (Width:Height)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ratio of duct width to height. Recommended range: 1:1 to 4:1</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm font-medium">{formData.aspectRatio}:1</span>
                    </div>
                    <Slider
                      id="aspectRatio"
                      min={1}
                      max={4}
                      step={0.1}
                      value={[formData.aspectRatio]}
                      onValueChange={handleAspectRatioChange}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setResult(null)}>
                Reset
              </Button>
              <Button onClick={handleCalculate}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reference Values</CardTitle>
            <CardDescription>Recommended values for duct design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Recommended Velocities</h3>
              <ul className="text-sm space-y-1">
                <li>Main ducts: 5-8 m/s</li>
                <li>Branch ducts: 3-5 m/s</li>
                <li>Terminal devices: 2-3 m/s</li>
                <li>Low noise areas: 2-4 m/s</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Aspect Ratio Guidelines</h3>
              <ul className="text-sm space-y-1">
                <li>Ideal ratio: 1:1 to 2:1</li>
                <li>Maximum recommended: 4:1</li>
                <li>Higher ratios increase pressure loss</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Typical Friction Rates</h3>
              <ul className="text-sm space-y-1">
                <li>Low pressure: 0.8 Pa/m</li>
                <li>Medium pressure: 1.2 Pa/m</li>
                <li>High pressure: 2.0 Pa/m</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>Optimal duct parameters based on inputs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Flow Parameters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Airflow Rate:</span>
                    <span className="font-medium">{formData.flowRate} m³/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Velocity:</span>
                    <span className="font-medium">{formData.velocity} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duct Area:</span>
                    <span className="font-medium">{result.area.toFixed(3)} m²</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Duct Dimensions</h3>
                <div className="space-y-2">
                  {tab === "round" ? (
                    <>
                      <div className="flex justify-between">
                        <span>Diameter:</span>
                        <span className="font-medium">{(result.diameter * 1000).toFixed(0)} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Perimeter:</span>
                        <span className="font-medium">{(Math.PI * result.diameter * 1000).toFixed(0)} mm</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span className="font-medium">{(result.width * 1000).toFixed(0)} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Height:</span>
                        <span className="font-medium">{(result.height * 1000).toFixed(0)} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equivalent Diameter:</span>
                        <span className="font-medium">{(result.equivalentDiameter * 1000).toFixed(0)} mm</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Friction Loss:</span>
                    <span className="font-medium">{result.frictionLoss.toFixed(2)} Pa/m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friction Rate Level:</span>
                    <span className={`font-medium ${
                      result.frictionLoss < 1.0 
                        ? "text-green-600" 
                        : result.frictionLoss < 2.0 
                        ? "text-yellow-600" 
                        : "text-red-600"
                    }`}>
                      {result.frictionLoss < 1.0 
                        ? "Low" 
                        : result.frictionLoss < 2.0 
                        ? "Medium" 
                        : "High"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DuctSizing;
