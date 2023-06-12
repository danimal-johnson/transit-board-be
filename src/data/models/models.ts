const db = require('../db-config');
// Usage: import yourLocalName from '../models/models';
// Access example: yourLocalName.getAllRoutes()

// This export format mimics the CommonJS format by knexjs,
// but can be imported as an ES module.
export default {
  getAgencyInfo,
  getAllRoutes,
  getRouteById,
  getStopById,
  getStopsByRoute,
  getStopTimesByStopAndDate,
};

// ----- Helper functions -----

function getServiceIdsByDate(date: string) {
  // Date is in YYYYMMDD format
  return db('calendar_dates')
    .where('date', date)
    .select('service_id');
}

function getAgencyInfo() {
  return db('agency').first();
}

// ---------- Routes ----------

function getAllRoutes() {
  return db('routes');
}

function getRouteById(id: any) {
  return db('routes')
    .where('route_id', id)
    .first();
}

// ---------- Stops ----------

function getStopById(id: any) {
  return db('stops')
    .where('stop_id', id)
    .first();
}


// Get all stops for a route
// FIXME: Too many columns error?
async function getStopsByRoute(routeId: any) {
// SELECT DISTINCT stop_times.stop_id, stops.stop_name
// FROM stop_times
// INNER JOIN stops ON stop_times.stop_id=stops.stop_id
// WHERE trip_id IN (SELECT trip_id FROM trips WHERE route_id = '91');
  const tripIdQuery = db.select('trip_id')
    .distinct()
    .from('trips')
    .where('route_id', routeId)
    .select('trip_id');
  console.log(typeof(tripIdQuery), tripIdQuery.length);
  
  // return tripIdQuery;

  // const stopQuery = db.select('stop_id', 'stop_name')

  return db('stop_times')
    .whereIn('trip_id', tripIdQuery)
    .select('stop_id')
    .distinct();
    
  //   .distinct()
  //   .innerJoin('stop_times', 'stops.stop_id', 'stop_times.stop_id')
  //   // .join('stop_times', 'stops.stop_id', 'stop_times.stop_id')
  //   .whereIn('stop_id', tripIdQuery)
}

// ---------- Stop times ----------

async function getStopTimesByStopAndDate(stopId: any, date: any, routeId?: any) {

  let query = db('stop_times')
    .select('departure_time', 'stop_headsign', 'trip_headsign')
    .where('stop_id', stopId)
    .whereIn('service_id', getServiceIdsByDate('20230605'))
    .orderBy('departure_time');

    if (routeId) {
      query = query.where('route_id', routeId);
    }

    return query;
}

// where and andWhere seem to be the same