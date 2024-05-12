import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const OverviewCard = ({
  icon,
  title,
  description,
  amount,
}: {
  amount: string | number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="max-w-[400px] min-w-[300px]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{amount}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCard;
