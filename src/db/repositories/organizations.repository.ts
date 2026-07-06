import { eq } from "drizzle-orm";

import { db } from "../connect";
import organization, { type Organization } from "../models/organization";

export const getOrganizationById = async (organizationId: string): Promise<Organization | undefined> => {
    const result = await db.select().from(organization).where(eq(organization.id, organizationId));
    return result[0];
}

export const deleteOrganizationById = async (organizationId: string): Promise<Organization | undefined> => {
    const result = await db.delete(organization).where(eq(organization.id, organizationId)).returning();
    return result[0];
}