import { FlatNamespace } from 'i18next';
// eslint-disable-next-line no-restricted-imports
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getServerTranslations(
  locale: string | undefined,
  namespaces: FlatNamespace[]
) {
  return serverSideTranslations(locale ?? 'en', ['common', ...namespaces]);
}
