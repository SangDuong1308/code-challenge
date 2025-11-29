import express from 'express';
import {
  createResource,
  listResources,
  getResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController';
import { createResourceValidator, updateResourceValidator } from '../middleware/validate';


const router = express.Router();

router.post('/', createResourceValidator, createResource);
router.get('/', listResources);
router.get('/:id', getResource);
router.put('/:id', updateResourceValidator, updateResource);
router.delete('/:id', deleteResource);

export default router;