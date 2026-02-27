"use client"

import { locales } from "@/i18n/config"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { useTransition } from "react"

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={l === locale || isPending}
          className="px-2 py-1 rounded-md border border-gray-300 cursor-pointer disabled:opacity-50"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
