import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { familyService, CreateFamilyInput, CreateFamilyMemberInput, UpdateFamilyInput, UpdateFamilyMemberInput } from '../services/familyService';

export const familyController = {
  // Create a new family
  createFamily: async (req: Request<{}, {}, CreateFamilyInput>, res: Response) => {
    try {
      const family = await familyService.createFamily(req.body);
      res.status(201).json(family);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({ error: 'Invalid data provided' });
      } else {
        console.error('Error creating family:', error);
        res.status(500).json({ error: 'Failed to create family' });
      }
    }
  },

  // Get all families
  getAllFamilies: async (_req: Request, res: Response) => {
    try {
      const families = await familyService.getAllFamilies();
      res.json(families);
    } catch (error) {
      console.error('Error fetching families:', error);
      res.status(500).json({ error: 'Failed to fetch families' });
    }
  },

  // Get a family by ID
  getFamilyById: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const family = await familyService.getFamilyById(req.params.id);
      if (!family) {
        return res.status(404).json({ error: 'Family not found' });
      }
      res.json(family);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          return res.status(400).json({ error: 'Invalid family ID format' });
        }
      }
      console.error('Error fetching family:', error);
      res.status(500).json({ error: 'Failed to fetch family' });
    }
  },

  // Update a family
  updateFamily: async (req: Request<{ id: string }, {}, UpdateFamilyInput>, res: Response) => {
    try {
      const family = await familyService.updateFamily(req.params.id, req.body);
      res.json(family);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Family not found' });
        }
      }
      console.error('Error updating family:', error);
      res.status(500).json({ error: 'Failed to update family' });
    }
  },

  // Delete a family
  deleteFamily: async (req: Request<{ id: string }>, res: Response) => {
    try {
      await familyService.deleteFamily(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Family not found' });
        }
      }
      console.error('Error deleting family:', error);
      res.status(500).json({ error: 'Failed to delete family' });
    }
  },

  // Add a member to a family
  addFamilyMember: async (req: Request<{ familyId: string }, {}, CreateFamilyMemberInput>, res: Response) => {
    try {
      const member = await familyService.addFamilyMember(req.params.familyId, req.body);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Email already exists' });
        } else if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Family not found' });
        }
      }
      console.error('Error adding family member:', error);
      res.status(500).json({ error: 'Failed to add family member' });
    }
  },

  // Remove a member from a family
  removeFamilyMember: async (req: Request<{ memberId: string }>, res: Response) => {
    try {
      await familyService.removeFamilyMember(req.params.memberId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Family member not found' });
        }
      }
      console.error('Error removing family member:', error);
      res.status(500).json({ error: 'Failed to remove family member' });
    }
  },

  // Update a family member
  updateFamilyMember: async (req: Request<{ memberId: string }, {}, UpdateFamilyMemberInput>, res: Response) => {
    try {
      const member = await familyService.updateFamilyMember(req.params.memberId, req.body);
      res.json(member);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Family member not found' });
        } else if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }
      console.error('Error updating family member:', error);
      res.status(500).json({ error: 'Failed to update family member' });
    }
  },
};
