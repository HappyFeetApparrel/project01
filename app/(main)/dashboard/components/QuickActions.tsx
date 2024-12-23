"use client";

import { FileText, Package, Truck, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useMemo } from "react";

interface QuickAction {
  icon: JSX.Element;
  label: string;
  shortcut: string;
  action: () => void;
}

export default function QuickActions() {
  const actions = useMemo<QuickAction[]>(
    () => [
      {
        icon: <FileText className="h-5 w-5 text-muted-foreground" />,
        label: "Create Order",
        shortcut: "ctrl + n",
        action: () => console.log("Create Order clicked"),
      },
      {
        icon: <Package className="h-5 w-5 text-muted-foreground" />,
        label: "Add Product",
        shortcut: "ctrl + p",
        action: () => console.log("Add Product clicked"),
      },
      {
        icon: <Truck className="h-5 w-5 text-muted-foreground" />,
        label: "Add Supplier",
        shortcut: "ctrl + k",
        action: () => console.log("Add Supplier clicked"),
      },
      {
        icon: <Upload className="h-5 w-5 text-muted-foreground" />,
        label: "Export",
        shortcut: "ctrl + s",
        action: () => console.log("Export clicked"),
      },
    ],
    []
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            actions[0].action();
            break;
          case "p":
            e.preventDefault();
            actions[1].action();
            break;
          case "k":
            e.preventDefault();
            actions[2].action();
            break;
          case "s":
            e.preventDefault();
            actions[3].action();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions]);

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex w-full items-center justify-between px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                {action.icon}
                <span>{action.label}</span>
              </div>
              <span className="text-xs">{action.shortcut}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
