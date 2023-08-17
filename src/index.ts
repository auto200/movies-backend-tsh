import { initApp } from "./app";

const app = initApp();

app.listen(3000, () => {
  console.log("listening on port 3000");
});
