import express from 'express';
import clusterRouter from './clusterRouter';
import promRouter from './promRouter';
import authRouter from './authRouter';

const api = express.Router();

api.use('/clusters', clusterRouter);
api.use('/prom', promRouter);
api.use('/auth', authRouter);

export default api;