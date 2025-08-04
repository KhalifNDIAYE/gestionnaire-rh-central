import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AccessibleFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  multiline?: boolean;
  required?: boolean;
  error?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AccessibleFormField = ({
  id,
  label,
  type = 'text',
  multiline = false,
  required = false,
  error,
  description,
  value,
  onChange,
  placeholder,
  className
}: AccessibleFormFieldProps) => {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          required && "after:content-['*'] after:ml-1 after:text-destructive"
        )}
      >
        {label}
      </Label>
      
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}
      
      <InputComponent
        id={id}
        type={!multiline ? type : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={ariaDescribedBy}
        className={cn(
          error && "border-destructive focus:ring-destructive"
        )}
      />
      
      {error && (
        <p 
          id={errorId}
          role="alert"
          className="text-sm text-destructive"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};