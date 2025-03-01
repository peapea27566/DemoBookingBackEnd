import { Router } from "express";
import userRoutes from "./userRoutes";
import bookingRoutes from "./bookingRoutes";

const apiRouter = Router();

apiRouter.use(userRoutes);
apiRouter.use(bookingRoutes);

export default apiRouter;
