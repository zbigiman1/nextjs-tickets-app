'use client'

import { useLocale } from 'next-intl'

export default function FormatedDate({ date }: { date: string }) {
  const locale = useLocale()
  let dateFormat = 'pl-PL'
  if (locale === 'en') {
    dateFormat = 'en-US'
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  const formatedDate = new Date(date).toLocaleString(dateFormat, options)

  return <>{formatedDate}</>
}
