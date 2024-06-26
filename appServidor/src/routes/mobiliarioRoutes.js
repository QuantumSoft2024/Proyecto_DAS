const express = require('express');
const router = express.Router();
const { addBienes, getAllBienes, getMobiliarioByName,editBienes ,deleteBienes} = require('../controllers/mobiliarioController.js');



router.get('/', getAllBienes);
router.get('/nombre/:nombre', getMobiliarioByName);
router.post('/', addBienes);
router.put('/:id', editBienes);
router.delete('/:id', deleteBienes);
module.exports = router;