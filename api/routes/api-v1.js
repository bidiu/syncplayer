const { Router } = require('express');
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const venueController = require('../controllers/venue');
const roomController = require('../controllers/room');
const videoController = require('../controllers/video');

const asyncWrapper = func =>
  async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };

const router = Router();

/*
 * auth related routes start
 */
router.get('/auth/signin', asyncWrapper(authController.signin));

router.get('/auth/signout', asyncWrapper(authController.signout));


/*
 * user related routes start
 */
router.get('/users/:userId', asyncWrapper(userController.retrieve));

router.post('/users', asyncWrapper(userController.create));

router.patch('/users/:userId', asyncWrapper(userController.update));


/*
 * venue related routes start
 */
router.get('/venues', asyncWrapper(venueController.index));

router.get('/venues/:venueId', asyncWrapper(venueController.retrieve));

router.post('/venues', asyncWrapper(venueController.create));

router.patch('/venues/:venueId', asyncWrapper(venueController.update));

router.get('/venue/types', asyncWrapper(venueController.indexTypes));

router.get('/venue/booked', asyncWrapper(venueController.indexBooked));


/**
 * room realted routes start
 */
router.get('/rooms/:roomId', asyncWrapper(roomController.retrieve));

router.post('/rooms', asyncWrapper(roomController.create));


/**
 * video related routes start
 */
router.get('/videos/info/extract', asyncWrapper(videoController.extractVideoInfo));

module.exports = router;
