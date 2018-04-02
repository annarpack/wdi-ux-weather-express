const router = require('express').Router(),
    Places = require('../models/places');

router.get('/',
  Places.findAll,
  Places.weatherData,
    (req, res) => {
        const { places } = res.locals;
        const { weatherData } = res.locals;
        res.json({
          places: places,
          weatherData: weatherData
        });
    });

router.get('/:id',
  Places.findByPlaceId,
  (req, res) => {
        const {onePlaceData} = res.locals
        res.json({onePlaceData: onePlaceData});
    });

router.post('/:searchTerm',
    Places.search,
    Places.returnFive,
    (req, res) => {
        const { arrayResults } = res.locals;
        res.json(arrayResults);
    });

router.get('/:searchTerm/:placeId',
    Places.searchPlaceId,
    (req, res) => {
        const { placeIdResults } = res.locals;
        res.json(placeIdResults);
    });

router.delete('/:id',
  Places.delete,
  (req, res) => {
    res.send('Deleted from DB.');
});


module.exports = router;
