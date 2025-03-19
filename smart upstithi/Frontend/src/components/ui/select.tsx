import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn("flex h-10 w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none", className)}
    {...props}
  >
    <SelectPrimitive.Value />
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="h-4 w-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-300 bg-white p-1 shadow-lg", className)}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn("flex cursor-pointer items-center rounded-sm px-2 py-1 text-sm hover:bg-gray-200", className)}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator>
      <CheckIcon className="ml-auto h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectValue = SelectPrimitive.Value;


export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
