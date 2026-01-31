interface ServiceBadgeProps {
  label: string
}

export function ServiceBadge({ label }: ServiceBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
      {label}
    </span>
  )
}
