import errorHandler from "./middlewares/error_handler";
import rApi from "./routes/r.api";
import { LocalHono } from "./types/LocalHono";

const app = new LocalHono();

app.route("/api", rApi);

app.onError(errorHandler);

export default app;
