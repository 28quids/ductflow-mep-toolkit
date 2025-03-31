
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, FileDown, Info, Plus, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculatePumpHead } from "@/utils/calculators";
import { useToast } from "@/hooks/use-toast";

interface Fitting {
  id: string;
  type: string;
  count: number;
}

const PumpHeadLoss = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    flowRate: 2.5, // L/s
    pipeLength: 50, // m
    pipeSize: 25, // mm
    material: "copper",
  });
  
  const [fittings, setFittings] = useState<Fitting[]>([
    { id: "1", type: "elbow_90", count: 4 },
    { id: "2", type: "check_valve", count: 1 },
  ]);
  
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFittingChange = (id: string, field: 'type' | 'count', value: string | number) => {
    setFittings(prev => 
      prev.map(fitting => 
        fitting.id === id 
          ? { ...fitting, [field]: value } 
          : fitting
      )
    );
  };

  const addFitting = () => {
    const newId = String(Date.now());
    setFittings(prev => [...prev, { id: newId, type: "elbow_90", count: 1 }]);
  };

  const removeFitting = (id: string) => {
    setFittings(prev => prev.filter(fitting => fitting.id !== id));
  };

  const handleCalculate = () => {
    // Convert fittings array to the format expected by the calculation function
    const fittingsCount: Record<string, number> = {};
    fittings.forEach(fitting => {
      fittingsCount[fitting.type] = (fittingsCount[fitting.type] || 0) + fitting.count;
    });
    
    const calculationResult = calculatePumpHead(
      formData.flowRate,
      formData.pipeLength,
      formData.pipeSize,
      fittingsCount,
      formData.material
    );
    
    setResult(calculationResult);
    
    toast({
      title: "Calculation Complete",
      description: "Pump head loss calculation has been performed successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your calculation results are being prepared for export.",
    });
  };

  const getFittingName = (type: string): string => {
    const names: Record<string, string> = {
      'elbow_90': '90° Elbow',
      'elbow_45': '45° Elbow',
      'tee': 'Tee (Branch Flow)',
      'gate_valve': 'Gate Valve',
      'globe_valve': 'Globe Valve',
      'check_valve': 'Check Valve',
      'entrance': 'Entrance',
      'exit': 'Exit'
    };
    
    return names[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pump Head Loss Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate pump head requirements based on system parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Parameters</CardTitle>
            <CardDescription>Enter pipe and flow details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="flowRate">Flow Rate (L/s)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The volume of water flowing through the system per second</p>
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
                  <Label htmlFor="pipeLength">Pipe Length (m)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total equivalent length of all pipes in the system</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="pipeLength"
                  name="pipeLength"
                  type="number"
                  value={formData.pipeLength}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pipeSize">Pipe Size (mm)</Label>
                <Select
                  value={String(formData.pipeSize)}
                  onValueChange={(value) => handleSelectChange("pipeSize", value)}
                >
                  <SelectTrigger id="pipeSize">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 mm</SelectItem>
                    <SelectItem value="20">20 mm</SelectItem>
                    <SelectItem value="25">25 mm</SelectItem>
                    <SelectItem value="32">32 mm</SelectItem>
                    <SelectItem value="40">40 mm</SelectItem>
                    <SelectItem value="50">50 mm</SelectItem>
                    <SelectItem value="65">65 mm</SelectItem>
                    <SelectItem value="80">80 mm</SelectItem>
                    <SelectItem value="100">100 mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="material">Pipe Material</Label>
                <Select
                  value={formData.material}
                  onValueChange={(value) => handleSelectChange("material", value)}
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
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Fittings and Valves</h3>
                <Button variant="outline" size="sm" onClick={addFitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fitting
                </Button>
              </div>
              
              <div className="space-y-2">
                {fittings.map(fitting => (
                  <div key={fitting.id} className="flex items-center gap-2">
                    <Select
                      value={fitting.type}
                      onValueChange={(value) => handleFittingChange(fitting.id, 'type', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elbow_90">90° Elbow</SelectItem>
                        <SelectItem value="elbow_45">45° Elbow</SelectItem>
                        <SelectItem value="tee">Tee (Branch Flow)</SelectItem>
                        <SelectItem value="gate_valve">Gate Valve</SelectItem>
                        <SelectItem value="globe_valve">Globe Valve</SelectItem>
                        <SelectItem value="check_valve">Check Valve</SelectItem>
                        <SelectItem value="entrance">Entrance</SelectItem>
                        <SelectItem value="exit">Exit</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="w-20">
                      <Input
                        type="number"
                        value={fitting.count}
                        onChange={(e) => handleFittingChange(fitting.id, 'count', parseInt(e.target.value) || 0)}
                        min={1}
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFitting(fitting.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
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
            <CardDescription>Equivalent length factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">K-Values for Fittings</h3>
              <div className="text-sm space-y-1">
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>90° Elbow:</div>
                  <div>0.75</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>45° Elbow:</div>
                  <div>0.4</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>Tee (Branch):</div>
                  <div>1.0</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>Gate Valve:</div>
                  <div>0.2</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>Globe Valve:</div>
                  <div>10.0</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>Check Valve:</div>
                  <div>2.5</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>Entrance:</div>
                  <div>0.5</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>Exit:</div>
                  <div>1.0</div>
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
              <CardDescription>Pump head requirements based on inputs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Head Loss Details</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Pipe Friction Loss</TableCell>
                      <TableCell>{result.frictionLoss.toFixed(2)} m</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fittings Loss</TableCell>
                      <TableCell>{result.fittingsLoss.toFixed(2)} m</TableCell>
                    </TableRow>
                    <TableRow className="border-t-2">
                      <TableCell className="font-medium">Total Head Loss</TableCell>
                      <TableCell className="font-semibold text-secondary">{result.totalHead.toFixed(2)} m</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Fittings Summary</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fitting Type</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fittings.map(fitting => (
                        <TableRow key={fitting.id}>
                          <TableCell>{getFittingName(fitting.type)}</TableCell>
                          <TableCell className="text-right">{fitting.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Pump Requirements</h3>
                <div className="p-6 bg-accent rounded-md mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary">{result.totalHead.toFixed(1)} m</div>
                    <div className="text-sm text-muted-foreground">Required Pump Head</div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{formData.flowRate} L/s</div>
                      <div className="text-xs text-muted-foreground">Flow Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{result.pumpPower.toFixed(2)} kW</div>
                      <div className="text-xs text-muted-foreground">Pump Power</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">System Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Pipe Size:</span>
                      <span className="font-medium">{formData.pipeSize} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Material:</span>
                      <span className="font-medium">
                        {formData.material === "pvc" 
                          ? "PVC" 
                          : formData.material === "cast_iron" 
                          ? "Cast Iron" 
                          : formData.material === "galvanized_steel" 
                          ? "Galvanized Steel" 
                          : formData.material.charAt(0).toUpperCase() + formData.material.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pipe Length:</span>
                      <span className="font-medium">{formData.pipeLength} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Friction Loss Rate:</span>
                      <span className="font-medium">{(result.frictionLoss / formData.pipeLength).toFixed(3)} m/m</span>
                    </div>
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

export default PumpHeadLoss;
