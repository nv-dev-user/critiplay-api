import { Hono } from "hono";

const organization = new Hono().basePath('/organization');

// TODOs

organization.get('/', (c) => {
    return c.json({ message: 'Organization route is working!' }, 200);
})

organization.get('/:organizationId', (c) => {
    const { organizationId } = c.req.param();
    return c.json({ message: `Organization route is working for organizationId: ${organizationId}` }, 200);
})

organization.post('/', async (c) => {
    const requestBody = await c.req.json();
    return c.json({ message: 'Organization created successfully!', data: requestBody }, 201);
})

organization.patch('/:organizationId', async (c) => {
    const { organizationId } = c.req.param();
    const requestBody = await c.req.json();
    return c.json({ message: `Organization with ID ${organizationId} updated successfully!`, data: requestBody }, 200);
})

organization.delete('/:organizationId', (c) => {
    const { organizationId } = c.req.param();
    return c.json({ message: `Organization with ID ${organizationId} deleted successfully!` }, 200);
})

export default organization;