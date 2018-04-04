const db = require('../db/config');
const axios = require('axios');

const Places = {}

Places.search = (req, res, next) => {
  //console.log('places.search');
    const { searchTerm } = req.params;
    axios.post(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchTerm}&types=(cities)&key=${process.env.GOOGLE_API_KEY}`
    ).then(response => {
        const fiveResults = response.data.predictions;
        res.locals.fiveResults = fiveResults;
        next();
    }).catch(err => console.log('error in places.search ', err));
}

Places.returnFive = (req, res, next) => {
    //console.log('places.returnFive');
    const arrayResults = [];
    let city = "";
    let state = "";
    let country = "";
    let placeId = "";
    res.locals.fiveResults.forEach(e => {
        city = e.terms[0].value;
        if (e.terms.length <= 2) {
            country = e.terms[1].value;
        } else if (e.terms.length > 2) {
            state = e.terms[1].value;
            country = e.terms[2].value;
        }
        placeId = e.place_id;

        arrayResults.push({
            city: city,
            state: state,
            country: country,
            placeId: placeId
        })
    })
    res.locals.arrayResults = arrayResults;
    next();
}

Places.searchPlaceId = (req, res, next) => {
    //console.log('places.searchPlaceId');
    const { placeId } = req.params;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.GOOGLE_API_KEY}`)
        .then(response => {
          let city = "";
          let state = "";
          let country = "";

            res.locals.placeIdResults = response.data.results[0];
            const placeId = res.locals.placeIdResults.place_id;
            const lat = res.locals.placeIdResults.geometry.location.lat;
            const long = res.locals.placeIdResults.geometry.location.lng;
            if (res.locals.placeIdResults.address_components.length > 3) {
              city = res.locals.placeIdResults.address_components[0].long_name;
              console.log('city', city);
              state = res.locals.placeIdResults.address_components[2].short_name;
              country = res.locals.placeIdResults.address_components[3].long_name;
            } else {
              city = res.locals.placeIdResults.address_components[0].long_name;
              state = res.locals.placeIdResults.address_components[1].short_name;
              country = res.locals.placeIdResults.address_components[2].long_name;
            }
          db.one(
            `INSERT INTO places (placeId, city, state, country, lat, long) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
            [placeId, city, state, country, lat, long]
            )
          next();
        })
        .catch(err => console.log('error in places.searchPlaceId ', err));
  }

  Places.findAll = (req, res, next) => {
    //console.log('findAll');
    db.manyOrNone('SELECT * FROM places').then(places => {
      //console.log('places', places)
      res.locals.places = places;
      next();
    }).catch(err => console.log("findAll err", err))
  }

  Places.weatherData = (req, res, next) => {
    //console.log('weatherData');
    const places = res.locals.places;
    //console.log('places', res.locals.places)
    let weatherCalls = [];

    places.forEach(function(place){
      weatherCalls.push(axios(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${place.lat},${place.long}?exclude=minutely,hourly,alerts,flags`));
    });
    axios.all(weatherCalls)
      .then(response => {
        res.locals.weatherData = [];
        response.forEach(function(response){
          res.locals.weatherData.push(response.data);
        })
        next();
      }).catch(err => console.log("weatherData err", err))
  }

Places.findByPlaceId = (req,res,next) => {
  const { id } = req.params;
  db.one(`SELECT lat, long from PLACES WHERE id = $1`, [id])
  .then(data => {
      axios(`https://api.darksky.net/forecast/${process.env.DARKSKY_API}/${data.lat},${data.long}`)
        .then(onePlaceData => {
            res.locals.onePlaceData = onePlaceData.data;
            next();
            }
         ).catch(err => console.log("findByPlaceId axios err", err))
    })
}

  Places.delete = (req, res, next) => {
    const {id} = req.params;
    db.none('DELETE FROM places WHERE id = $1', [id])
    next();
  }

module.exports = Places;
