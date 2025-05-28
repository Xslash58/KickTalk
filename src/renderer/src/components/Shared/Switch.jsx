"use client";

import { forwardRef } from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import clsx from "clsx";

const Switch = forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root className={clsx("switch", className)} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className={clsx("switchThumb", className)} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
