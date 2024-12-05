import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type CreateFamilyInput = {
  name: string;
  description?: string;
};

export type CreateFamilyMemberInput = {
  name: string;
  email: string;
  role: string;
};

export type UpdateFamilyInput = Partial<CreateFamilyInput>;
export type UpdateFamilyMemberInput = Partial<CreateFamilyMemberInput>;

export const familyService = {
  // Create a new family
  createFamily: async (data: CreateFamilyInput) => {
    return prisma.family.create({
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        members: true,
      },
    });
  },

  // Get all families
  getAllFamilies: async () => {
    return prisma.family.findMany({
      include: {
        members: {
          include: {
            portfolios: true,
          },
        },
      },
    });
  },

  // Get a family by ID
  getFamilyById: async (id: string) => {
    return prisma.family.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            portfolios: true,
          },
        },
      },
    });
  },

  // Update a family
  updateFamily: async (id: string, data: UpdateFamilyInput) => {
    return prisma.family.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        members: true,
      },
    });
  },

  // Delete a family
  deleteFamily: async (id: string) => {
    return prisma.family.delete({
      where: { id },
      include: {
        members: true,
      },
    });
  },

  // Add a member to a family
  addFamilyMember: async (familyId: string, data: CreateFamilyMemberInput) => {
    return prisma.familyMember.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        family: {
          connect: { id: familyId }
        }
      },
      include: {
        family: true,
        portfolios: true,
      },
    });
  },

  // Remove a member from a family
  removeFamilyMember: async (memberId: string) => {
    return prisma.familyMember.delete({
      where: { id: memberId },
      include: {
        family: true,
        portfolios: true,
      },
    });
  },

  // Update a family member
  updateFamilyMember: async (memberId: string, data: UpdateFamilyMemberInput) => {
    return prisma.familyMember.update({
      where: { id: memberId },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
      include: {
        family: true,
        portfolios: true,
      },
    });
  },
};
