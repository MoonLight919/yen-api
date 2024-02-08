import { ManagementClient } from 'auth0';

const managementDomain = process.env.AUTH0_MANAGEMENT_DOMAIN;

let managementClient: ManagementClient;

export const getManagementClient = (): ManagementClient => {
  if (managementClient) {
    return managementClient;
  }
  managementClient = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN as string,
    clientId: process.env.AUTH0_CLIENT_ID as string,
    clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
    audience: `https://${managementDomain}/api/v2/`,
  });
  return managementClient;
};
