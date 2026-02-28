/**
 * Auth0 Credentials Exchange Action
 * 
 * This action runs during token exchange (client credentials flow).
 * Used for machine-to-machine authentication.
 * 
 * Install in Auth0 Dashboard: Actions > Library > Build Custom > Credentials Exchange
 */

exports.onExecuteCredentialsExchange = async ({ client, scope, audience, context, api }) => {
  const NAMESPACE = 'https://smart-college';
  
  // Validate audience
  if (audience !== 'https://smart-college-api') {
    api.access.deny('Invalid audience');
    return;
  }
  
  // Add custom claims for M2M tokens
  api.accessToken.setCustomClaim(`${NAMESPACE}/client`, client.name);
  api.accessToken.setCustomClaim(`${NAMESPACE}/type`, 'm2m');
  
  console.log(`M2M token issued for client: ${client.name}`);
};
