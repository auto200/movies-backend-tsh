import { Equals, assert } from 'tsafe';

import commonEN from '../../public/locales/en/common.json';
import commonPL from '../../public/locales/pl/common.json';

assert<Equals<typeof commonEN, typeof commonPL>>;
