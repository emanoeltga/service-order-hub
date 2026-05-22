import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();
    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <Input id={inputId} ref={ref} {...props} />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
FormInput.displayName = "FormInput";
