import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from "../../../src/lib/utils"; 
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";

type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export interface ActivityItem {
  id: string;
  icon: IconType;
  message: React.ReactNode;
  timestamp: string;
  iconColorClass?: string;
}

export interface RecentActivityFeedProps {
  activities: ActivityItem[];
  cardTitle?: string;
  className?: string;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  cardTitle = "System Telemetry",
  className,
}) => {
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm italic">
            Awaiting system events...
          </div>
        ) : (
          <motion.div layout className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors duration-200 group"
                >
                  <div className={cn("flex-shrink-0 p-2.5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform", activity.iconColorClass || "text-gray-400 bg-gray-900")}>
                    <activity.icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <p className="text-sm font-medium text-gray-200 leading-tight">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1.5 font-mono">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};