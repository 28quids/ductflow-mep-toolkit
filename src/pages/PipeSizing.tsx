
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, FileDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculatePipeSize } from "@/utils/calculators";
import { useToast } from "@/hooks/use-toast";

const PipeSizing = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    flowRate: 2.5, // L/s
    velocity: 1.5, // m/s
    material: "pvc",
  });
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      material: value,
    });
  };

  const handleCalculate = () => {
    const calculationResult = calculatePipeSize(
      formData.flowRate,
      formData.velocity,
      formData.material
    );
    
    setResult(calculationResult);
    
    toast({
      title: "Calculation Complete",
      description: "Pipe sizing calculation has been performed successfully.",
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
        <h1 className="text-3xl font-bold tracking-tight">Pipe Sizing Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate optimal pipe dimensions based on flow requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>Enter the required flow parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="flowRate">Flow Rate (L/s)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The volume of water flowing through the pipe per second</p>
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
                  <Label htmlFor="velocity">Velocity (m/s)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Recommended: 0.75-2.5 m/s for water pipes</p>
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
              
              <div className="space-y-2">
                <Label htmlFor="material">Pipe Material</Label>
                <Select
                  value={formData.material}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="pvc">PVC</SelectItem>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="cast_iron">Cast Iron</SelectItem>
                    <SelectItem value="galvanized_steel">Galvanized Steel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
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
            <CardTitle>Reference Values</CardTitle>
            <CardDescription>Recommended values for pipe design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Recommended Velocities</h3>
              <ul className="text-sm space-y-1">
                <li>Small pipes (≤ 50mm): 0.75-1.5 m/s</li>
                <li>Medium pipes: 1.0-2.0 m/s</li>
                <li>Large pipes (≥ 100mm): 1.5-2.5 m/s</li>
                <li>Low noise areas: 0.75-1.25 m/s</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Material Roughness</h3>
              <ul className="text-sm space-y-1">
                <li>Copper: 0.0015 mm</li>
                <li>PVC: 0.0015 mm</li>
                <li>Steel: 0.045 mm</li>
                <li>Cast Iron: 0.26 mm</li>
                <li>Galvanized Steel: 0.15 mm</li>
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
              <CardDescription>Optimal pipe parameters based on inputs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Pipe Specifications</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Calculated Diameter</TableCell>
                      <TableCell>{result.diameter.toFixed(2)} mm</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Recommended Size</TableCell>
                      <TableCell className="font-semibold text-secondary">{result.recommendedSize} mm</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Flow Rate</TableCell>
                      <TableCell>{formData.flowRate} L/s</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Design Velocity</TableCell>
                      <TableCell>{formData.velocity} m/s</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Material</TableCell>
                      <TableCell>
                        {formData.material === "pvc" 
                          ? "PVC" 
                          : formData.material === "cast_iron" 
                          ? "Cast Iron" 
                          : formData.material === "galvanized_steel" 
                          ? "Galvanized Steel" 
                          : formData.material.charAt(0).toUpperCase() + formData.material.slice(1)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Performance Analysis</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Pressure Loss</TableCell>
                      <TableCell>{result.pressureLoss.toFixed(2)} Pa/m</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reynolds Number</TableCell>
                      <TableCell>{result.reynoldsNumber.toFixed(0)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Flow Type</TableCell>
                      <TableCell>
                        {result.reynoldsNumber < 2300 
                          ? "Laminar" 
                          : result.reynoldsNumber < 4000 
                          ? "Transitional" 
                          : "Turbulent"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Pressure Loss per 100m</TableCell>
                      <TableCell>{(result.pressureLoss * 100 / 1000).toFixed(2)} kPa</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Velocity Check</TableCell>
                      <TableCell className={
                        formData.velocity < 0.75 
                          ? "text-yellow-600" 
                          : formData.velocity > 2.5 
                          ? "text-red-600" 
                          : "text-green-600"
                      }>
                        {formData.velocity < 0.75 
                          ? "Below Recommended (Risk of Air/Sediment)" 
                          : formData.velocity > 2.5 
                          ? "Above Recommended (Risk of Noise/Erosion)" 
                          : "Within Recommended Range"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PipeSizing;
