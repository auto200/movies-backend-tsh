import 'dotenv/config';

import { appConfig } from '@/config/appConfig';
import { connectJSONDb } from '@/config/database/connectJSONDb';
import { createRootService } from '@/rootService';

import { initApp } from './app';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const conn = await connectJSONDb();
  const rootService = createRootService(conn);

  await rootService.moviesSearchEngineService.setupSearchRules();

  const app = initApp(rootService);

  app.listen(appConfig.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`listening on port ${appConfig.PORT}`);
  });
})();
