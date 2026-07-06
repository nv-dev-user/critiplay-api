import type { Context } from "hono";
import type { Env } from "..";
import { getUserRoleInOrganization } from "@/db/repositories/organization_profile.repository";
import { deleteOrganizationById, getOrganizationById } from "@/db/repositories/organizations.repository";

export const organizationHandler = async (c: Context<Env>) => {
    const { organizationId } = c.req.param();

    const organization = await getOrganizationById(organizationId);
    return c.json({ organization }, 200);
}

export const organizationDeletionHandler = async (c: Context<Env>) => {
    const { supabase } = c.get('supabaseContext');
    const { organizationId } = c.req.param();

    const organization = await getOrganizationById(organizationId);
    if (!organization) {
        return c.json({ message: `Organization with ID ${organizationId} not found.` }, 404);
    }

    // User is authenticated (withSupabase middleware ensures this)
    const supabaseUser = await supabase.auth.getUser();

    const role = await getUserRoleInOrganization(supabaseUser.data.user!.id, organizationId);
    if (role !== 'owner') {
        return c.json({ message: 'You are not authorized to delete this organization.' }, 403);
    }

    // The user can now delete the organization
    await deleteOrganizationById(organizationId);

    return c.json({ message: `Organization deleted successfully!` }, 200);
}

// TODOs

export const organizationCreationHandler = async (c: Context<Env>) => {
    const requestBody = await c.req.json();
    return c.json({ message: 'Organization created successfully!', data: requestBody }, 201);
}

export const organizationPatchHandler = async (c: Context<Env>) => {
    const { organizationId } = c.req.param();
    const requestBody = await c.req.json();
    return c.json({ message: `Organization with ID ${organizationId} updated successfully!`, data: requestBody }, 200);
}

export const organizationListHandler = (c: Context<Env>) => {
    return c.json({ message: 'Organization list route is working!' }, 200);
}