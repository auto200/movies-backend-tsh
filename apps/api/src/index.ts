import 'dotenv/config';

import { createRootService } from '@/common/infrastructure/rootService';
import { appConfig } from '@/config/appConfig';
import { connectJSONDb } from '@/config/database/connectJSONDb';

import { initApp } from './app';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const conn = await connectJSONDb();
  const rootService = createRootService(conn);

  await rootService.searchEngineService.setupSearchRules();

  const app = initApp(rootService);

  app.listen(appConfig.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`listening on port ${appConfig.PORT}`);
  });
})();
