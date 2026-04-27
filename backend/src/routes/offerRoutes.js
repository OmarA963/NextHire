const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['CANDIDATE']));

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: AI-powered job offer comparison tool
 *
 * /api/offers/compare:
 *   post:
 *     summary: Compare multiple job offers and get AI recommendation
 *     tags: [Offers]
 *
 * /api/offers/my-offers:
 *   get:
 *     summary: Get all my past offer comparisons
 *     tags: [Offers]
 *
 * /api/offers/{id}:
 *   delete:
 *     summary: Delete an offer comparison
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */

router.post('/compare', offerController.compareOffers);
router.get('/my-offers', offerController.getMyOffers);
router.delete('/:id', offerController.deleteOffer);

module.exports = router;
