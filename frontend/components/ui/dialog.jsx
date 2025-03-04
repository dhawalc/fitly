import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const Dialog = ({ children, ...props }) => {
  return <div className="relative z-50" {...props}>{children}</div>
}

const DialogTrigger = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

const DialogPortal = ({ children, ...props }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" {...props}>
      {children}
    </div>
  )
}

const DialogOverlay = ({ className, ...props }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 ${className}`}
      {...props}
    />
  )
}

const DialogContent = ({ className, children, onOpenChange, ...props }) => {
  return (
    <DialogPortal>
      <DialogOverlay onClick={() => onOpenChange?.(false)} />
      <div
        className={`fixed z-50 grid w-full max-w-lg scale-100 gap-4 bg-white p-6 opacity-100 shadow-lg rounded-lg ${className}`}
        {...props}
      >
        {children}
        <button
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          onClick={() => onOpenChange?.(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  )
}

const DialogHeader = ({ className, ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-2 text-left ${className}`}
      {...props}
    />
  )
}

const DialogFooter = ({ className, ...props }) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
      {...props}
    />
  )
}

const DialogTitle = ({ className, ...props }) => {
  return (
    <div
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    />
  )
}

const DialogDescription = ({ className, ...props }) => {
  return (
    <div
      className={`text-sm text-gray-500 ${className}`}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} 