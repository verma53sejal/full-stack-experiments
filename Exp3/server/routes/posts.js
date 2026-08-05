const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roles('Admin', 'Editor', 'Viewer'), postController.getPosts);
router.post('/', authMiddleware, roles('Admin', 'Editor'), postController.createPost);
router.put('/:id', authMiddleware, roles('Admin', 'Editor'), postController.updatePost);
router.delete('/:id', authMiddleware, roles('Admin'), postController.deletePost);

module.exports = router;
