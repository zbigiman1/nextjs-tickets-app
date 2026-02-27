import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, locales } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale

  const locale =
    typeof resolvedLocale === 'string' && locales.includes(resolvedLocale as never)
      ? resolvedLocale
      : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
