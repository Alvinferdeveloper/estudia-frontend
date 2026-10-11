"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FieldControlContext {
  id: string
  describedBy?: string
  invalid: boolean
}

const FieldContext = React.createContext<FieldControlContext | null>(null)

interface FieldControlProps {
  id?: string
  "aria-describedby"?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
}

// Lets a control inside a Field pick up its id, hint/error description and invalid state; explicit props win.
function useFieldControl<T extends FieldControlProps>(props: T): T {
  const field = React.useContext(FieldContext)
  if (!field) return props
  return {
    ...props,
    id: props.id ?? field.id,
    "aria-describedby": props["aria-describedby"] ?? field.describedBy,
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
  }
}

interface FieldProps {
  id: string
  label: React.ReactNode
  hint?: React.ReactNode
  // Replaces the hint while present.
  error?: React.ReactNode
  className?: string
  children: React.ReactNode
}

// Label, control and the message below it, wired together for assistive technology.
function Field({ id, label, hint, error, className, children }: FieldProps) {
  const messageId = `${id}-message`
  const message = error || hint
  const context = React.useMemo(
    () => ({ id, describedBy: message ? messageId : undefined, invalid: Boolean(error) }),
    [id, message, messageId, error]
  )

  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <FieldContext.Provider value={context}>{children}</FieldContext.Provider>
      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export { Field, useFieldControl }
