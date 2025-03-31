
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Calculator, FileDown, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateVAVBoxSize } from "@/utils/calculators";
import { useToast } from "@/hooks/use-toast";

const VAVSizing = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    designAirflow: 500, // cfm
    minAirflow: 125, // cfm
    staticPressure: 1.0, // in.wg
    turndownRatio: 25, // %
  });
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value) || 0;
    
    if (name === "turndownRatio") {
      setFormData({
        ...formData,
        [name]: newValue,
        minAirflow: formData.designAirflow * (newValue / 100),
      });
    } else if (name === "minAirflow") {
      setFormData({
        ...formData,
        [name]: newValue,
        turndownRatio: (newValue / formData.designAirflow) * 100,
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue,
      });
      
      // Update minimum airflow to maintain the turndown ratio
      if (name === "designAirflow") {
        setFormData(prev => ({
          ...prev,
          [name]: newValue,
          minAirflow: newValue * (prev.turndownRatio / 100),
        }));
      }
    }
  };

  const handleTurndownChange = (value: number[]) => {
    const turndownRatio = value[0];
    setFormData({
      ...formData,
      turndownRatio,
      minAirflow: formData.designAirflow * (turndownRatio / 100),
    });
  };

  const handleCalculate = () => {
    const calculationResult = calculateVAVBoxSize(
      formData.designAirflow,
      formData.minAirflow,
      formData.staticPressure
    );
    
    setResult(calculationResult);
    
    toast({
      title: "Calculation Complete",
      description: "VAV box sizing calculation has been performed successfully.",
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
        <h1 className="text-3xl font-bold tracking-tight">VAV Box Sizing Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate optimal VAV box size based on airflow requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter the required airflow parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="designAirflow">Design Airflow (CFM)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum airflow required for the zone</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="designAirflow"
                  name="designAirflow"
                  type="number"
                  value={formData.designAirflow}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="staticPressure">Static Pressure (in.wg)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Available static pressure at VAV box inlet</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="staticPressure"
                  name="staticPressure"
                  type="number"
                  step="0.1"
                  value={formData.staticPressure}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="turndownRatio">Turndown Ratio (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum airflow as percentage of design airflow</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium">{formData.turndownRatio}%</span>
                </div>
                <Slider
                  id="turndownRatio"
                  min={10}
                  max={50}
                  step={5}
                  value={[formData.turndownRatio]}
                  onValueChange={handleTurndownChange}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="minAirflow">Minimum Airflow (CFM)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Calculated based on turndown ratio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="minAirflow"
                  name="minAirflow"
                  type="number"
                  value={formData.minAirflow.toFixed(0)}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Typical VAV turndown ratios range from 20-30% for zones with constant occupancy.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end space-x-2">
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
            <CardTitle>Sizing Guidelines</CardTitle>
            <CardDescription>Standard VAV box sizing reference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Standard VAV Box Sizes</h3>
              <div className="text-sm space-y-1">
                <div className="grid grid-cols-3 gap-2 text-center py-1 font-medium border-b">
                  <div>Size</div>
                  <div>Min CFM</div>
                  <div>Max CFM</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>6"</div>
                  <div>100</div>
                  <div>450</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>8"</div>
                  <div>175</div>
                  <div>800</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>10"</div>
                  <div>280</div>
                  <div>1,250</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>12"</div>
                  <div>405</div>
                  <div>1,800</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>14"</div>
                  <div>550</div>
                  <div>2,450</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div>16"</div>
                  <div>720</div>
                  <div>3,200</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>Optimal VAV box parameters based on inputs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Box Selection</h3>
                <div className="p-4 bg-accent rounded-md">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary">{result.recommendedSize}</div>
                    <div className="text-sm text-muted-foreground">Recommended VAV Box Size</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Airflow Parameters</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Design Airflow:</span>
                    <span className="font-medium">{formData.designAirflow} CFM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Airflow:</span>
                    <span className="font-medium">{formData.minAirflow.toFixed(0)} CFM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turndown Ratio:</span>
                    <span className="font-medium">{formData.turndownRatio}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neck Velocity:</span>
                    <span className={`font-medium ${
                      result.neckVelocity < 1200 
                        ? "text-green-600" 
                        : result.neckVelocity < 1800 
                        ? "text-yellow-600" 
                        : "text-red-600"
                    }`}>
                      {result.neckVelocity.toFixed(0)} FPM
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pressure Drop:</span>
                    <span className="font-medium">{result.pressureDrop.toFixed(2)} in.wg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acoustic Level:</span>
                    <span className={`font-medium ${
                      result.soundLevel === "Low" 
                        ? "text-green-600" 
                        : result.soundLevel === "Medium" 
                        ? "text-yellow-600" 
                        : "text-red-600"
                    }`}>
                      {result.soundLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Control Authority:</span>
                    <span className="font-medium">
                      {result.pressureDrop > 0.1 ? "Good" : "Poor"}
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

export default VAVSizing;
