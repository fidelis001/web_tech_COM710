const router = require("express").Router();
const {
  getAnimals,
  updateAnimalById,
  deleteAnimalById,
  getAnimalById,
  createAnimal,
  getLocation,
  dropLocationDb,
  dropAnimalDb,
  seedDb,
} = require("../controllers/animal");
const { checkAuthenticated } = require("../middleware/auth");

router.get("/animals", getAnimals);
router.post("/animals", checkAuthenticated, createAnimal);
router.get("/animals/:id", getAnimalById);
router.put("/animals/:id", checkAuthenticated, updateAnimalById);
router.delete("/animals/:id", checkAuthenticated, deleteAnimalById);
router.get("/location", getLocation);
router.get("/drop", dropLocationDb);
router.get("/dropAnimalDb", dropAnimalDb);

module.exports = router;
