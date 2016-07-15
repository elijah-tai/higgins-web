'use strict';

var express = require('express');
var controller = require('./member.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/findByIds', controller.findByIds);
router.post('/findByPhone', controller.findByPhone);

module.exports = router;
