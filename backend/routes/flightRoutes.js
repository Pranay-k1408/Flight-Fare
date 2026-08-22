import express from 'express';
import {
  searchAirports,
  searchFlights,
  getFlightDetails,
  getFareCalendar,
  getAirlines,
  bookFlight
} from '../controllers/flightController.js';

const router = express.Router();

router.get('/airports/search', searchAirports);
router.get('/search', searchFlights);
router.get('/fare-calendar', getFareCalendar);
router.get('/airlines', getAirlines);
router.post('/book', bookFlight);
router.get('/:id', getFlightDetails);

export default router;
