import express from 'express';

//import all routes
import clusterRouter from './clusterRouter';
import userRouter from './userRouter';

const api = express.Router();

api.use('/clusters', clusterRouter);
api.use('/users', userRouter);

export default api;
