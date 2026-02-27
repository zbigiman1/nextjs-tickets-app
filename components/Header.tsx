import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const t = await getTranslations()

  return (
    <header className="bg-sky-600 text-white p-4 md:p-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
