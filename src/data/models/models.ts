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
  getDeparturesByStopAndDate,
  getAllStations,
  getStopsByStationId
};

// ----- Helper functions -----

function getServiceIdsByDate(date: string) {
  // Date is in YYYYMMDD format
  return db('calendar_dates')
    .where('date', date)
    .select('service_id');
}

async function getStartDate() {
  return db('calendar_dates')
    .select('date')
    .orderBy('date')
    .first();
}

async function getEndDate() {
  return db('calendar_dates')
    .select('date')
    .orderBy('date', 'desc')
    .first();
}

// ---- General Info Endpoints ----

async function getAgencyInfo() {
  const start_date = await getStartDate();
  const end_date = await getEndDate();
  const agencyInfo = await db('agency').first();
  return { ...agencyInfo, start_date, end_date };
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

async function getStopsByRoute(routeId: any) {
  const tripIdQuery = db.select('trip_id')
    .distinct()
    .from('trips')
    .where('route_id', routeId);
  
  return db('stop_times')
    .whereIn('trip_id', tripIdQuery)
    .join('stops', 'stop_times.stop_id', '=', 'stops.stop_id')
    .select('stops.stop_id', 'stops.stop_name')
    .distinct();
}

// ---------- Stop times ----------

async function getDeparturesByStopAndDate(stopId: any, date: any, routeId?: any) {

  let query = db('stop_times')
    .select('departure_time', 'stop_headsign', 'trip_headsign')
    .where('stop_id', stopId)
    .whereIn('service_id', getServiceIdsByDate(date))
    .orderBy('departure_time');

    if (routeId) {
      query = query.where('route_id', routeId);
    }

    return query;
}

// async function getStopsByRoute(routeId: any) {
//   const tripIdQuery = db.select('trip_id')
//     .distinct()
//     .from('trips')
//     .where('route_id', routeId);
  
//   return db('stop_times')
//     .whereIn('trip_id', tripIdQuery)
//     .join('stops', 'stop_times.stop_id', '=', 'stops.stop_id')
//     .select('stops.stop_id', 'stops.stop_name')
//     .distinct();
// }

// ---------- Stations ----------

async function getAllStations(/* db: Knex */): 
  Promise<{ stop_id: string, stop_name: string, stop_lat: string, stop_long: string }[]> {
  interface DatabaseRecord {
    stop_id: string;
    stop_name: string;
    parent_station: string;
  }

  try {
    const records: DatabaseRecord[] = await db.select('parent_station')
      .from('stops')
      .whereNotNull('parent_station');
      // .unique(); // Why does this throw an error?

    const referencedStops = records.map(record => record.parent_station);
    console.log("referencedStops =", referencedStops);
    
    return db('stops')
      .whereIn('stop_id', referencedStops)
      .select('stop_id', 'stop_name', 'stop_lat', 'stop_lon');

  } catch (error) {
    console.error('Error retrieving referenced stops:', error);
    return [];
  }
}

async function getStopsByStationId(stationId: any) {
  return db('stops')
    .where('parent_station', stationId)
    .select('stop_id', 'stop_name');
}
