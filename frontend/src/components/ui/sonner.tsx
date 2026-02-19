import { Toaster as Sonner, toast } from "sonner"
import "sonner/dist/styles.css"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      duration={1000000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[var(--color-surface)] group-[.toaster]:text-[var(--color-primary)] group-[.toaster]:border group-[.toaster]:border-[var(--color-primary)]/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[var(--color-primary)]/80",
          actionButton:
            "group-[.toast]:bg-[var(--color-primary)] group-[.toast]:text-[var(--color-surface)]",
          cancelButton:
            "group-[.toast]:bg-[var(--color-bg)] group-[.toast]:text-[var(--color-primary)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
