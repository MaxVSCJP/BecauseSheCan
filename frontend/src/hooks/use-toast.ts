import * as React from "react"
import { toast as sonnerToast, type ExternalToast } from "sonner"

const TOAST_DURATION = 1000000

type ToastVariant = "default" | "destructive"

type Toast = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  duration?: number
}

type ToastId = string | number

const showToast = (payload: Toast, toastId?: ToastId) => {
  const message = payload.title ?? payload.description
  const options: ExternalToast = {
    id: toastId,
    description: payload.title ? payload.description : undefined,
    duration: payload.duration ?? TOAST_DURATION,
  }

  if (payload.variant === "destructive") {
    return sonnerToast.error(message, options)
  }

  return sonnerToast(message, options)
}

function toast(payload: Toast) {
  const id = showToast(payload)

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (nextPayload: Toast) => {
      showToast(nextPayload, id)
    },
  }
}

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: (toastId?: ToastId) => sonnerToast.dismiss(toastId),
  }
}

export { TOAST_DURATION, useToast, toast }
