import express from 'express';

//import all routes
import clusterRouter from './clusterRouter';
import userRouter from './userRouter';
import promRouter from './promRouter';
import authRouter from './authRouter';
import initRouter from './initRouter'

const api = express.Router();

api.use('/clusters', clusterRouter);
api.use('/users', userRouter);
api.use('/prom', promRouter);
api.use('/auth', authRouter);
api.use('/init', initRouter);

export default api;