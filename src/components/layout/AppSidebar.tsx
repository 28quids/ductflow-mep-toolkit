
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Wind, 
  Droplet, 
  Box, 
  Gauge, 
  Power, 
  Calculator, 
  FileText, 
  Settings, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const AppSidebar = ({ isOpen, closeSidebar }: AppSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar, isMobile]);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/duct-sizing", label: "Duct Sizing", icon: <Wind className="w-5 h-5" /> },
    { path: "/pipe-sizing", label: "Pipe Sizing", icon: <Droplet className="w-5 h-5" /> },
    { path: "/vav-sizing", label: "VAV Box Sizing", icon: <Box className="w-5 h-5" /> },
    { path: "/pump-head", label: "Pump Head Loss", icon: <Gauge className="w-5 h-5" /> },
    { path: "/pressure-drop", label: "Pressure Drop", icon: <Power className="w-5 h-5" /> },
    { path: "/other-calcs", label: "Other Calcs", icon: <Calculator className="w-5 h-5" /> },
    { path: "/projects", label: "My Projects", icon: <FileText className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out",
    {
      "translate-x-0": isOpen || !isMobile,
      "-translate-x-full": !isOpen && isMobile,
    }
  );

  return (
    <>
      <div ref={sidebarRef} className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">MEP Toolkit</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={closeSidebar} className="text-sidebar-foreground">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent group transition-colors",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "text-sidebar-foreground"
                    )
                  }
                  onClick={isMobile ? closeSidebar : undefined}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/70">
          <p>DuctFlow MEP Toolkit v1.0</p>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default AppSidebar;
