import type { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/components/ui'
import { cn } from '@/lib/utils'

type ConfirmDialogProps = {
  triggerLabel: ReactNode
  triggerTone?: 'secondary' | 'brand'
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
}

export function ConfirmDialog({
  triggerLabel,
  triggerTone = 'secondary',
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={triggerTone === 'brand' ? 'default' : 'outline'}
          className={cn(
            'h-14 w-full gap-2 rounded-14 text-body-14-strong',
            triggerTone === 'brand'
              ? 'bg-brand text-fg-on-brand hover:bg-brand-hover'
              : 'border-line bg-surface text-fg-secondary hover:bg-canvas',
          )}
          type="button"
        >
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction className="bg-brand text-fg-on-brand hover:bg-brand-hover" onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
