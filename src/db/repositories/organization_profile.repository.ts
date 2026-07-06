import { eq, and } from "drizzle-orm";
import { db } from "../connect";
import type { OrganizationRoleTypes } from "../enums/organizationRoles";
import organization_profile, {
  type OrganizationProfile,
} from "../models/organization_profile";

export const getUserRoleInOrganization = async (
  userId: string,
  organizationId: string,
): Promise<OrganizationRoleTypes | null> => {
  const result = await db
    .select()
    .from(organization_profile)
    .where(
      and(
        eq(organization_profile.profile, userId),
        eq(organization_profile.organization, organizationId),
      ),
    );

  if (result.length === 0) {
    return null; // User is not part of the organization
  }

  return result[0].role; // Return the role of the user in the organization
};

export const isUserInOrganization = async (
  userId: string,
  organizationId: string,
): Promise<boolean> => {
  const result = await db
    .select()
    .from(organization_profile)
    .where(
      and(
        eq(organization_profile.profile, userId),
        eq(organization_profile.organization, organizationId),
      ),
    );

  return result.length > 0; // Returns true if the user is part of the organization, false otherwise
};

export const updateUserRoleInOrganization = async (
  userId: string,
  organizationId: string,
  newRole: OrganizationRoleTypes,
): Promise<OrganizationProfile | undefined> => {
  const result = await db
    .update(organization_profile)
    .set({ role: newRole })
    .where(
      and(
        eq(organization_profile.profile, userId),
        eq(organization_profile.organization, organizationId),
      ),
    )
    .returning();

  return result[0]; // Return the updated record
};

export const addUserToOrganization = async (
  userId: string,
  organizationId: string,
  role: OrganizationRoleTypes,
): Promise<OrganizationProfile | undefined> => {
  const result = await db
    .insert(organization_profile)
    .values({
      profile: userId,
      organization: organizationId,
      role: role,
    })
    .returning();

  return result[0]; // Return the newly created record
};

export const deleteUserFromOrganization = async (
  userId: string,
  organizationId: string,
): Promise<OrganizationProfile | undefined> => {
  const result = await db
    .delete(organization_profile)
    .where(
      and(
        eq(organization_profile.profile, userId),
        eq(organization_profile.organization, organizationId),
      ),
    )
    .returning();

  return result[0]; // Return the deleted record
};
