import Express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

import Routes from './routes';

const expressApp = Express();

expressApp.use(json());

expressApp.use('/todos', Routes);

expressApp.use(
	(err: Error, req: Request, res: Response, next: NextFunction) => {
		res.status(500).send(err.message);
	}
);

expressApp.listen(4000);
