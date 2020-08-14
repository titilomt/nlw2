import express, { json } from "express";
import cors from "cors";
import routes from "./routes";

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());
app.use(json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
