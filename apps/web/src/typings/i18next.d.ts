import 'i18next';

import commonEN from '../../public/locales/en/common.json';

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: { common: typeof commonEN };
  }
}
