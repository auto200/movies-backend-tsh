import "dotenv/config";
import { appConfig } from "@config/appConfig";
import { initApp } from "./app";

const app = initApp();

app.listen(appConfig.PORT, () => {
  console.log("listening on port 3000");
});
