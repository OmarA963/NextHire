const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const upload = require('../services/upload');

router.use(authMiddleware);
router.use(roleMiddleware(['CANDIDATE']));

/**
 * @swagger
 * /api/cvs/upload:
 *   post:
 *     summary: Upload CV PDF
 *     tags: [CVs]
 * /api/cvs/my-cvs:
 *   get:
 *     summary: Get candidate CVs
 *     tags: [CVs]
 * /api/cvs/builder:
 *   post:
 *     summary: Save CV Builder JSON data
 *     tags: [CVs]
 * /api/cvs/{id}:
 *   put:
 *     summary: Update an existing CV's JSON data
 *     tags: [CVs]
 *   delete:
 *     summary: Delete a CV
 *     tags: [CVs]
 */

router.post('/upload', upload.single('cv_file'), cvController.uploadCV);
router.post('/builder', cvController.saveCVBuilderData);
router.get('/my-cvs', cvController.getMyCVs);
router.put('/:id', cvController.updateCVBuilderData);
router.delete('/:id', cvController.deleteCV);

module.exports = router;
