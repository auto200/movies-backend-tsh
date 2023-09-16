import 'dotenv/config';

import { initApp } from './app';

import { appConfig } from '@/config/appConfig';
import { connectJSONDb } from '@/config/database/connectJSONDb';
import { createRootService } from '@/config/rootService';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
connectJSONDb()
  .then(createRootService)
  .then(initApp)
  .then((app) =>
    app.listen(appConfig.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`listening on port ${appConfig.PORT}`);
    })
  );
