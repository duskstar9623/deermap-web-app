'use client'

import { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  title?: string
  children: ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
          {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
          <div className="mb-6">{children}</div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant="primary" onClick={onConfirm}>
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
