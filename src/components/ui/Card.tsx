'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="border-b border-gray-200 pb-4 mb-4">{children}</div>
}

interface CardBodyProps {
  children: ReactNode
}

export function CardBody({ children }: CardBodyProps) {
  return <div className="mb-4">{children}</div>
}

interface CardFooterProps {
  children: ReactNode
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="border-t border-gray-200 pt-4 mt-4">{children}</div>
}
