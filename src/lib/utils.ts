export type CsvValue = string | number | boolean | null | undefined
export type CsvRow = Record<string, CsvValue>

function toCsvCell(value: CsvValue): string {
  if (value === null || value === undefined) {
    return ''
  }
  const raw = String(value).replace(/"/g, '""')
  if (raw.includes(',') || raw.includes('"') || raw.includes('\n')) {
    return `"${raw}"`
  }
  return raw
}

export function exportCsv(filename: string, rows: CsvRow[]): void {
  if (rows.length === 0) {
    return
  }

  const headers = Object.keys(rows[0] ?? {})
  const content = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => toCsvCell(row[header])).join(',')),
  ].join('\n')

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function formatDateTime(isoString: string): string {
  const parsed = new Date(isoString)
  if (Number.isNaN(parsed.getTime())) {
    return isoString
  }

  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

export function toTitleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
