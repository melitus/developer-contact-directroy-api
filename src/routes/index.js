const express = require('express');

const developerRoutes = require('./developer.route');
const authRoutes = require('./auth.route');
const verificationRoutes = require('./verify.route');
const generationRoutes = require('./generate.route');

const router = express.Router();

/**
 * GET /status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET /docs
 */
router.use('/docs', express.static('docs'));

router.use('/developers', developerRoutes);
router.use('/auth', authRoutes);
router.use('/verify', verificationRoutes);
router.use('/generate', generationRoutes);

module.exports = router;
