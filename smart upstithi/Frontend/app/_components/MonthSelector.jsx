"use client";
import React, { useState } from "react";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addMonths } from "date-fns";
import { Calendar } from "@/components/ui/Calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

const months = Array.from({ length: 12 }, (_, i) =>
  moment().month(i).format("MMM yyyy")
);

function MonthSelector({ setMonth }) {
  const today = new Date();
  const [localMonth, setLocalMonth] = useState(today);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 items-center text-slate-500">
            <CalendarDays className="h-5 w-5" />
            {moment(localMonth).format("MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-40">
          <ScrollArea className="h-60">
            <div className="flex flex-col gap-2">
              {months.map((month, index) => (
                <Button
                  key={index}
                  variant={moment(localMonth).format("MMM yyyy") === month ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    const selectedDate = moment(month, "MMM yyyy").toDate();
                    setLocalMonth(selectedDate);
                    setMonth(selectedDate);
                  }}
                >
                  {month}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonthSelector;
