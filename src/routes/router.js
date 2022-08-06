// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const studentsController = require('../controllers/studentsController.js');

router.get('/', studentsController.show);
router.post('/add', studentsController.save);
router.get('/delete/:id', studentsController.delete);
router.get('/update/:id', studentsController.edit);
router.post('/update/:id', studentsController.update);

module.exports = router;
