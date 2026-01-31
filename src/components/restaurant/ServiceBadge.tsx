import { cn } from '@/lib/utils'

interface ServiceBadgeProps {
  service: string
}

const SERVICE_STYLES: Record<string, string> = {
  WOLT: 'bg-sky-50 text-sky-700',
  GLOVO: 'bg-yellow-50 text-yellow-700',
  MANUAL: 'bg-gray-100 text-gray-700',
}

export function ServiceBadge({ service }: ServiceBadgeProps) {
  const label = service.charAt(0) + service.slice(1).toLowerCase()
  const style = SERVICE_STYLES[service] ?? 'bg-gray-100 text-gray-700'

  return (
    <span className={cn('rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide', style)}>
      {label}
    </span>
  )
}
