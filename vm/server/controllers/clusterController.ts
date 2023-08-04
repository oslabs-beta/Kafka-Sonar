import { query } from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

const clusterController = {
  postCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { client, host, port, auth, username, password, network } =
        req.body;
      const request =
        'INSERT INTO clusters (client_id, bootstrap_hostname, port_number, auth_mechanism, username, password, app_cluster_id, user_network) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
      // const request =
      //   'WITH new_cluster AS (INSERT INTO clusters (client_id, bootstrap_hostname, port_number, auth_mechanism, username, password, app_cluster_id, user_network) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING * ) INSERT INTO users_in_clusters (user_id, cluster_id) SELECT $9 AS user_id, new_cluster.cluster_id FROM new_cluster;';
      const values: any[] = [
        client,
        host,
        port,
        auth,
        username,
        password,
        '',
        network,
      ];
      const response: any = await query(request, values);
      res.locals.cluster_id = response.rows[0].cluster_id;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.postCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postUserCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id } = req.params;
      const request =
        'INSERT INTO users_in_clusters (user_id, cluster_id) VALUES ($1,$2) RETURNING *';
      const values: any[] = [user_id, res.locals.cluster_id];
      const response: any = await query(request, values);
      // console.log('response', response.rows[0]);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.postUserCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postJmxPort: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { brokerInfo } = req.body;
      const { cluster_id } = res.locals;
      console.log('BROKER INFO in postJMXPorts', brokerInfo);
      // iterate through brokers to generate an array o
      // iterate through brokerInfo and make a query for each broker
      for (const broker of brokerInfo) {
        const request = 'INSERT INTO jmx_ports (cluster_id, jmx_hostname, jmx_port_number) VALUES ($1,$2,$3) RETURNING *';
        const values: string[] = [
          cluster_id,
          broker.host,
          broker.port,
        ];
        await query(request, values);
      }
      //res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.postJmxPort Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getUserClusters: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id } = req.params;
      const request =
        'SELECT * FROM clusters JOIN users_in_clusters ON clusters.cluster_id = users_in_clusters.cluster_id WHERE users_in_clusters.user_id = $1';
      const values: any = [user_id];
      const response: any = await query(request, values);
      console.log('getUserClusters --->', response.rows);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getUserClusters Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id } = req.params;
      const request = 'DELETE FROM clusters WHERE cluster_id = $1 RETURNING *';
      const values: any[] = [cluster_id];
      const response: any = await query(request, values);
      console.log('deleteCluster response-->', response.rows);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deleteCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteUserCluster: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { user_id, cluster_id } = req.params;
      const request =
        'DELETE FROM users_in_clusters WHERE user_id = $1 AND cluster_id = $2 RETURNING *';
      const values: any[] = [user_id, cluster_id];
      const response: any = await query(request, values);
      console.log('deleteUserCluster response-->', response.rows);
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deleteUserCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  deleteJmxPort: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id, port_id } = req.params;
      const request =
        'DELETE FROM jmx_ports WHERE cluster_id = $1 AND port_id = $2 RETURNING *';
      const values: any[] = [cluster_id, port_id];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.deleteJmxPort Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getCluster: async (
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
        log: 'Error occured in clusterController.getCluster Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getJmxPorts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id } = req.params;
      const request = 'SELECT * FROM jmx_ports WHERE cluster_id = $1';
      const values: any = [cluster_id];
      const response: any = await query(request, values);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getJmxPorts Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  postClusterError: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id } = req.params;
      const { message } = req.body;

      console.log(cluster_id, message);

      const request =
        'INSERT INTO error_logs (cluster_id, message) VALUES ($1,$2) RETURNING *';
      const values: any[] = [cluster_id, message];
      const response: any = await query(request, values);
      res.locals.cluster = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.postClusterError Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  getClusterErrors: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown> => {
    try {
      const { cluster_id } = req.params;
      const request = 'SELECT * FROM error_logs WHERE cluster_id = $1';
      const values: any = [cluster_id];
      const response: any = await query(request, values);
      res.locals.clusters = response.rows;
      return next();
    } catch (err) {
      return next({
        log: 'Error occured in clusterController.getClusterErrors Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
  // For testing purposes
  // Not used in app - getting all clusters for all users
  getAllClusters: async (
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
        log: 'Error occured in clusterController.getAllClusters Middleware',
        message: { err: JSON.stringify(err, Object.getOwnPropertyNames(err)) },
      });
    }
  },
};

export default clusterController;
