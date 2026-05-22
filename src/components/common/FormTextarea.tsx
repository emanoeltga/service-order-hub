import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import * as React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();
    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <Textarea id={inputId} ref={ref} {...props} />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
FormTextarea.displayName = "FormTextarea";
