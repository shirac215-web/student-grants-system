const express = require('express');
const router = express.Router();
const { create, read, readOne, update, updateStatus, updateEducation, remove, getRequestStatus, submitRequest } = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/submit', auth, submitRequest);
router.post('/', create);
router.get('/', read);
router.get('/:id', readOne);
router.put('/:id', update);
router.patch('/:id/status', updateStatus);
router.patch('/:id/education', updateEducation);
router.delete('/:id', remove);
router.get('/user/:userId', getRequestStatus);

module.exports = router;
