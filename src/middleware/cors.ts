import cors from "cors";

const corsOptions = {
  origin: "http://localhost:3000", // replace with your frontend domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
