const express = require("express");
const router = express.Router();

const journalController = require("../controller/journalController");

router.post("/addJournal", journalController.addJournal);
router.get("/getAllJournals", journalController.getAllJournals);
router.post("/getJournalById", journalController.getJournalById);
router.post("/editJournal", journalController.editJournal);
router.post("/deleteJournalById", journalController.deleteJournalById);

module.exports = router;
