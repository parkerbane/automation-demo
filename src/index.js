import "core-js/stable";
import "regenerator-runtime/runtime";

import { config } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'Welcome to Automation Demo !!!'
    });
});

app.use((req, res, next) => {
    const err = new Error("URL does not exist");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
            req.method
        } - ${req.ip}`
    );
    res.status(err.status || 500).json({
        status: "error",
        error: {
            message: err.message || "Internal server error"
        }
    });
    next();
});

const port = parseInt(process.env.PORT, 10) || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;