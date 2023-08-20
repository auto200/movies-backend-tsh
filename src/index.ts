import "dotenv/config";

import { appConfig } from "@config/appConfig";
import { createRootService } from "@config/rootService";
import { connectJSONDb } from "@config/database/connectJSONDb";

import { initApp } from "./app";

connectJSONDb()
  .then(createRootService)
  .then(initApp)
  .then((app) =>
    app.listen(appConfig.PORT, () => {
      console.log(`listening on port ${appConfig.PORT}`);
    }),
  );
