import { Router } from 'express';
import { familyController } from '../controllers/familyController';

const router = Router();

// Family routes
router.post('/families', familyController.createFamily);
router.get('/families', familyController.getAllFamilies);
router.get('/families/:id', familyController.getFamilyById);
router.put('/families/:id', familyController.updateFamily);
router.delete('/families/:id', familyController.deleteFamily);

// Family member routes
router.post('/families/:familyId/members', familyController.addFamilyMember);
router.delete('/families/members/:memberId', familyController.removeFamilyMember);
router.put('/families/members/:memberId', familyController.updateFamilyMember);

export default router;
