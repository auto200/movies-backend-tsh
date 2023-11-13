import { FlatNamespace } from 'i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getServerTranslations(
  locale: string | undefined,
  namespaces: FlatNamespace[]
) {
  return serverSideTranslations(locale ?? 'en', ['common', ...namespaces]);
}
