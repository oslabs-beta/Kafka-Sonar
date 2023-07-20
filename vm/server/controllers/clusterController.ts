import { query } from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const clusterController = {
  getAllclusters: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const request = 'SELECT * FROM clusters';
      // const values: any = [];
      const response: any = await query(request);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getAllclusters Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getcluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const cluster_id = req.params.cluster_id;
      const request = 'SELECT * FROM clusters WHERE cluster_id = $1';
      const values: any[] = [cluster_id];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getcluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postcluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const {
        cluster_name,
        industry,
        cluster_type,
        cluster_description,
        host_id,
        total_attendees,
        cluster_location,
        cluster_status,
        date_time,
        cluster_price,
      } = req.body;
      const request =
        'INSERT INTO clusters (cluster_name, industry, cluster_type, cluster_description, host_id, total_attendees, cluster_location, cluster_status, date_time, cluster_price) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
      const values: any[] = [
        cluster_name,
        industry,
        cluster_type,
        cluster_description,
        host_id,
        total_attendees,
        cluster_location,
        cluster_status,
        date_time,
        cluster_price,
      ];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.postcluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  putcluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const cluster_id = req.params.cluster_id;
      const {
        cluster_name,
        industry,
        cluster_type,
        cluster_description,
        host_id,
        total_attendees,
        cluster_location,
        cluster_status,
        date_time,
        cluster_price,
      } = req.body;
      const request =
        'UPDATE clusters SET cluster_name = $1, industry = $2, cluster_type = $3, cluster_description = $4, host_id = $5, total_attendees =$6, cluster_location = $7, cluster_status = $8, date_time = $9, cluster_price = $10 WHERE cluster_id= $11 RETURNING *';
      const values: any[] = [
        cluster_name,
        industry,
        cluster_type,
        cluster_description,
        host_id,
        total_attendees,
        cluster_location,
        cluster_status,
        date_time,
        cluster_price,
        cluster_id,
      ];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.putcluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deletecluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const cluster_id = req.params.cluster_id;
      const request = 'DELETE FROM clusters WHERE cluster_id = $1 RETURNING *';
      const values: any[] = [cluster_id];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deletecluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
};

export default clusterController;
