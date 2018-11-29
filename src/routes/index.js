const express = require('express');

const developerRoutes = require('./developer.route');
const authRoutes = require('./auth.route');
const verificationRoutes = require('./verify.route');
const generationRoutes = require('./generate.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/developer', developerRoutes);
router.use('/auth', authRoutes);
router.use('/verify', verificationRoutes);
router.use('/generate', generationRoutes);

module.exports = router;
