"use client"

import React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <ToastViewport>
        {toasts.map(({ id, title, description, variant, ...props }) => (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex flex-col gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose onClick={() => useToast().dismiss(id)} />
          </Toast>
        ))}
      </ToastViewport>
    </ToastProvider>
  )
} 