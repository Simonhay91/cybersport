import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateShort(date: Date | string) {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  })
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
