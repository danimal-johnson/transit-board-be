
import { Router, Request, Response, NextFunction} from "express";
import db from '../models/models';

const router: Router = Router();

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
      res.status(500).json({message: 'Something went wrong', error: err.message});
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
      res.status(500).json({message: 'Something went wrong', error: err.message});
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
      res.json(route || {});
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err.message});
    });
});

// --------- Stops ----------

// GET all stops by category (route or station)
// Ex: "stops?route=01"
// Expect: [{ stop_id, stop_name }] of ALL stops on the route
// Note: Not every trip will necessarily serve each stop.
router.get('/stops', (req: Request, res: Response): void => {
  const { route, station } = req.query;
  if (!route && !station) {
    res.status(400).json({message: 'Please provide a route number or station ID'});
    return;
  }
  if (route) {
  db.getStopsByRoute(route)
    .then((stops: any) => { 
      res.json(stops || []);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err.message});
    });
    return;
  }
  if (station) {
    db.getStopsByStationId(station)
    .then((stops: any) => { 
      res.json(stops || []);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err.message});
    });
    return;
  }
});

// GET details for a specific stop
// Example: "stops/02507"
// Expect: {index, stop_id, stop_name, stop_lat, stop_lon,
//          parent_station, platform_code}
router.get('/stops/:id', (req: Request, res: Response): void => {
  let { id } = req.params;

  db.getStopById(id)
    .then((stop: any) => {
      res.json(stop || {});
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err.message});
    });
});

// --------- Stations ----------
// GET all stations
// Expect: [{stop_id, stop_name, stop_lat, stop_lon}]
router.get('/stations', (req: Request, res: Response): void => {
  db.getAllStations()
    .then((stations: any) => {

      res.json(stations);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err.message});
    });
});

// GET details for a specific station
// Just use the stop endpoint


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
    // console.log(`Interpreting today as ${date}`);
  }
  db.getDeparturesByStopAndDate(stop, date, route)
    .then((departures: any) => {
      res.json(departures);
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({message: 'Something went wrong', error: err.message});
    });
});

export default router;
