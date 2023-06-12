import { Router, Request, Response, NextFunction} from "express";
import db from '../models/models';

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send('<h2>Welcome to the API portion of the tour!<h2>');
});

router.get('/info', (req: Request, res: Response): void => {
  // Get the current time and convert it to Pacific time
  const now = new Date();
  const pacificTime = new Date(now.toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
  res.json({
    message: 'Metadata about the API will go here',
    localtime: pacificTime.toLocaleString()
  });
});

// --------- Routes ----------

router.get('/routes', (req: Request, res: Response): void => {
  db.getAllRoutes()
    .then((routes: any) => {
      res.json(routes);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
});

router.get('/routes/:id', (req: Request, res: Response): void => {
  let { id } = req.params;
  if (id === '1') id = '01'; // This is the only route with a leading zero

  db.getRouteById(id)
    .then((route: any) => {
      res.json(route);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
});

// --------- Stops ----------

router.get('/stops', (req: Request, res: Response): void => {
  const route = req.query.route;
  if (!route) {
    res.status(400).json({message: 'Please provide a route number'});
    return;
  }
  db.getStopsByRoute(route)
    .then((stops: any) => { res.json(stops); })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
});

router.get('/stops/:id', (req: Request, res: Response): void => {
  let { id } = req.params;
  if (id === '1') id = '01'; // This is the only route with a leading zero

  db.getStopById(id)
    .then((route: any) => {
      res.json(route);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
});

// --------- Departures ----------

router.get('/departures', (req: Request, res: Response): void => {
  let { stop, date, route } = req.query;
  if (!stop || !date) {
    res.status(400).json({message: 'Stop number and date are required.'});
    return;
  }
  
  db.getStopTimesByStopAndDate(stop, date, route)
    .then((departures: any) => { res.json(departures); })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
});

export default router;
