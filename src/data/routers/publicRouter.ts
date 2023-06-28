
import { Router, Request, Response, NextFunction} from "express";
import db from '../models/models';

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
  res.send(`<h1>Congrats! You found the API directory.<h1>\
  <h2>The Docs</h2>\
  <ul>\
  <li><a href="https://github.com/danimal-johnson/transit-board-be">Visit the full project on GitHub</a></li>\
  <li><a href="https://github.com/danimal-johnson/transit-board-be/blob/main/docs/endpoints.md">API Documentation (markdown)</a></li>\
  </ul>\
  <h2>Something to get you started</h2>\
  <ul>\
  <li>/info: Agency info, calendar range covered, current date and time</li>\
  <li>/routes: All the routes served by this API</li>\
  <li>/routes/91: Details about a specific route</li>\
  <li>/stops?route=01: All the stops on a route</li>\
  <li>/stops/02507: Details about a specific stop</li>\
  <li>/departures?stop=02507&date=20230624: All departures for a stop and date</li>\
  <li>/departures?stop=02507&date=20230624&route=01: Departures for a stop, date, and route</li>\
  </ul>\
  `);
});

router.get('/info', (req: Request, res: Response): void => {
  db.getAgencyInfo()
    .then((agency: any) => {
      const now = new Date();
      const agencyTime = agency.agency_timezone;
      res.json({
        agency_id: agency.agency_id,
        name: agency.agency_name,
        url: agency.agency_url,
        timezone: agencyTime,
        language: agency.agency_lang,
        start_date: agency.start_date.date,
        end_date: agency.end_date.date,
        utc_time: now.toUTCString(),
        server_time: now.toLocaleString(),
        local_time: now.toLocaleString('en-US', {timeZone: agencyTime})
      });
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
 });

// --------- Routes ----------

// GET all routes
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

// GET details about a specific route
// Example: "routes/91"
// Expect: { index, route_id, route_short_name, route_long_name }
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

// GET all stops on a ROUTE
// Ex: "stops?route=01"
// Expect: [{ stop_id, stop_name }] of ALL stops on the route
// Note: Not every trip will necessarily serve each stop.
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

// GET details for a specific stop
// Example: "stops/02507"
// Expect: {index, stop_id, stop_name, stop_lat, stop_lon,
//          parent_station, platform_code}
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

// GET departure times for a stop [and route] on a specific date
// Ex1: "departures?stop=02507&date=20230714&route=01"
// Ex2: "departures?stop=02507&date=today"
// Stop and date are required; route is optional
// Expect: [{{departure_time}, {stop_headsign}, {trip_headsign}}]
router.get('/departures', (req: Request, res: Response): void => {
  let { stop, date, route } = req.query;
  if (!stop || !date) {
    res.status(400).json({message: 'Stop number and date are required.'});
    return;
  }
  if (date === 'today') {
    // The API is served from random timezones. Convert to Pacific.
    let currentDate = new Date().toLocaleDateString("en-GB", {timeZone: "America/Los_Angeles"}).replace(/\//g, "-");
    // GB format is DD-MM-YYYY. Convert to YYYYMMDD
    date = currentDate.split('-').reverse().join('');
    console.log(`Interpreting today as ${date}`);
  }
  db.getDeparturesByStopAndDate(stop, date, route)
    .then((departures: any) => { res.json(departures); })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err});
    });
});

export default router;
