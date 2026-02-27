import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-gray-200 mt-8 py-4 text-center text-sm text-gray-600">
      <p>
        {t('copyright')} © {new Date().getFullYear()}
      </p>
    </footer>
  )
}
