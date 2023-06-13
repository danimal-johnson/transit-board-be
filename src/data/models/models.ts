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


  // return "TESTING";
  // let startDate = db('calendar_dates').min('date');
  // console.log(startDate);
  // let endDate = db('calendar_dates').max('date');
  // console.log(endDate);
  // console.log({ startDate, endDate })
  // return { startDate, endDate };
// }
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
    .select('stop_id')
    .distinct();
}

// ---------- Stop times ----------

async function getDeparturesByStopAndDate(stopId: any, date: any, routeId?: any) {

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