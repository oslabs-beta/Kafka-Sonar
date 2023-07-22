import express from 'express';

//import all routes
import clusterRouter from './clusterRouter';
import userRouter from './userRouter';
import configRouter from './configRouter'

const api = express.Router();

api.use('/clusters', clusterRouter);
api.use('/users', userRouter);
api.use('/configs', configRouter);

export default api;
