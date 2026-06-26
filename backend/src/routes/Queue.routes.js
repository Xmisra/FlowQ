import express from "express";
import restrictValidUserOnly from "../middlewares/auth.middleware.js";
import { handleCreateQueue, handleGetMyQueues, handleGetQueueById, handleUpdateQueue, handleDeleteQueue, handleCloseQueue, handleOpenQueue } from "../controllers/Queue.controller.js";

const queueRouter = express.Router();

queueRouter.post('/create', restrictValidUserOnly, handleCreateQueue);
queueRouter.get('/', restrictValidUserOnly, handleGetMyQueues);
queueRouter.get('/:queueId', restrictValidUserOnly, handleGetQueueById);
queueRouter.put('/:queueId', restrictValidUserOnly, handleUpdateQueue);
queueRouter.delete('/:queueId', restrictValidUserOnly, handleDeleteQueue);
queueRouter.patch("/:queueId/open",restrictValidUserOnly,handleOpenQueue);
queueRouter.patch("/:queueId/close",restrictValidUserOnly,handleCloseQueue);

export default queueRouter;