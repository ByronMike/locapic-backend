var express = require("express");
var router = express.Router();
const Place = require("../models/places");
const { checkBody } = require("../modules/checkBody");

router.post("/places", (req, res) => {
  // Version compactée de req.body.nickname, etc..)
  if (!checkBody(req.body, ["nickname", "name", "longitude", "latitude"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérification de l'existence de la ville (name aurait suffit)
  Place.findOne({
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    name: req.body.name,
  }).then((place) => {
    if (place !== null) {
      res.json({ result: false, error: "Place already exist" });
      return;
    }

    const newMarqueur = new Place({
      nickname: req.body.nickname,
      name: req.body.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });

    newMarqueur.save().then((userplace) => {
      res.json({ result: true, place: userplace });
    });
  });
});

// Get classique avec params
router.get("/places/:nickname", (req, res) => {
  Place.find({ nickname: req.params.nickname }).then((userplace) => {
    if (userplace === null) {
      res.json({ result: false, error: "Places not found" });
      return;
    }
    res.json({ result: true, places: userplace });
  });
});

router.delete("/places", (req, res) => {

  // Check si l'input est correctement rempli
  if (!checkBody(req.body, ["nickname", "name"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check si le retour de l'input correspond à un document de la BDD 
  Place.findOne({ nickname: req.body.nickname, name: req.body.name }).then(
    (userplace) => {
      if (userplace === null) {
        res.json({ result: false, error: "Place not found" });
        return;
      }

      // Suppression par rapport au nickname et name
      Place.deleteOne({
        nickname: req.body.nickname,
        name: req.body.name,
      }).then(() => {
        res.json({ result: true });
      });
    }
  );
});

module.exports = router;
