
import { PublicClientApplication } from "@azure/msal-node";
import dotenv from "dotenv";

dotenv.config();
/** @type {import('@azure/msal-node').Configuration */
const msalConfig = {
  auth: {
    clientId: process.env.MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.MSAL_TENANT_INFO}`,
  },
};


const pca = new PublicClientApplication(msalConfig);

// TODO use cache once working
const msalTokenCache = pca.getTokenCache();

export default [
  {
    method: "GET",
    path: "/login",
    /**
     * Handler for login.
     *
     * @param {import('@hapi/hapi').Request request - The Hapi request object
     * @param {import('@hapi/hapi').ResponseToolkit} h - The Hapi response toolkit
     * @returns {import('@hapi/hapi').ResponseObject} - A response containing the rivers or an error
     */
    handler: async (request, h) => {
      try {
        const username = request.query.username;
        const password = request.query.password;

        const usernamePasswordRequest = {
          scopes: [process.env.MSAL_SCOPE],
          username,
          password,
        };

        const response = await pca.acquireTokenByUsernamePassword(usernamePasswordRequest)

        return h.response(response).code(200);
      } catch (err) {
        console.log('well that didn\'t work: ' + err.stack);
        return h.response('error').code(500);
      }
    },
  }
]
