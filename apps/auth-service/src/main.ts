import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '../../../packages/middleware/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

//routes 

app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.port || 6001;
const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
})

server.on("error", (err) => {
  console.log("Server error:", err);
});