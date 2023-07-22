import express from 'express';

//import all routes
import clusterRouter from './clusterRouter';
import userRouter from './userRouter';
import initRouter from './initRouter'

const api = express.Router();

api.use('/clusters', clusterRouter);
api.use('/users', userRouter);
api.use('/init', initRouter);

export default api;
