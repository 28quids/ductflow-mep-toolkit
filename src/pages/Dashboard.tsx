
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Droplet, Box, Gauge, Calculator, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const calculatorItems = [
  {
    title: "Duct Sizing",
    description: "Calculate duct dimensions, velocity, and pressure loss",
    icon: <Wind className="h-8 w-8 text-primary" />,
    path: "/duct-sizing",
  },
  {
    title: "Pipe Sizing",
    description: "Size pipes based on flow rate, velocity, and material",
    icon: <Droplet className="h-8 w-8 text-primary" />,
    path: "/pipe-sizing",
  },
  {
    title: "VAV Box Sizing",
    description: "Determine optimal VAV box sizing for your zones",
    icon: <Box className="h-8 w-8 text-primary" />,
    path: "/vav-sizing",
  },
  {
    title: "Pump Head Loss",
    description: "Calculate pump head requirements and system curves",
    icon: <Gauge className="h-8 w-8 text-primary" />,
    path: "/pump-head",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to DuctFlow MEP Toolkit - your essential calculations in one place
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {calculatorItems.map((item) => (
          <Card 
            key={item.title} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {item.icon}
              </div>
              <CardTitle className="mt-4">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="ghost" className="px-0 text-primary">
                Open Calculator
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">Your recent projects will appear here</p>
              <Button variant="outline" className="w-full">Create New Project</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Units: Metric</Button>
                <Button variant="outline" size="sm">Standard: ASHRAE</Button>
                <Button variant="outline" size="sm">Theme: Light</Button>
                <Button variant="outline" size="sm">PDF Format</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
