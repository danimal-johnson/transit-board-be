const db = require('../db-config');
// Usage: import yourLocalName from '../models/models';
// Access example: yourLocalName.getAllRoutes()

// This export format mimics the CommonJS format by knexjs,
// but can be imported as an ES module.
export default {
  getAllRoutes,
  getRouteById,
  getStopById,
  getStopsByRoute,
  hello,
};

// This is a test function to make sure the db is working
function hello() {
  return new Promise((resolve, reject) => {
    resolve({hello: 'world'});
  });
}

// Arrow functions are not hoisted and must appear before they are exported
function getAllRoutes() {
  return db('routes');
}

function getRouteById(id: any) {
  return db('routes')
    .where('route_id', id)
    .first();
}

function getStopById(id: any) {
  return db('stops')
    .where('stop_id', id)
    .first();
}

// Get all stops for a route
function getStopsByRoute(routeId: any) {
  return db('stops')
    .where()
}

// SELECT DISTINCT stop_times.stop_id, stops.stop_name
// FROM stop_times
// INNER JOIN stops ON stop_times.stop_id=stops.stop_id
// WHERE trip_id IN (SELECT trip_id FROM trips WHERE route_id = '91');