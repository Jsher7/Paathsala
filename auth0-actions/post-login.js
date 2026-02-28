/**
 * Auth0 Post-Login Action
 * 
 * This action runs after every user login.
 * It adds custom claims to the token and handles first-time login scenarios.
 * 
 * Install in Auth0 Dashboard: Actions > Library > Build Custom > Post-Login
 */

exports.onExecutePostLogin = async ({ user, context, api }) => {
  const NAMESPACE = 'https://smart-college';
  
  // Get user metadata
  const role = user.user_metadata?.role || 'student';
  const department = user.user_metadata?.department || '';
  const mustChangePassword = user.user_metadata?.mustChangePassword || false;
  
  // Add custom claims to access token
  api.accessToken.setCustomClaim(`${NAMESPACE}/role`, role);
  api.accessToken.setCustomClaim(`${NAMESPACE}/department`, department);
  api.accessToken.setCustomClaim(`${NAMESPACE}/email`, user.email);
  
  // Add custom claims to ID token
  api.idToken.setCustomClaim(`${NAMESPACE}/role`, role);
  api.idToken.setCustomClaim(`${NAMESPACE}/department`, department);
  
  // Force password change on first login
  if (mustChangePassword) {
    api.redirect.sendUserTo('http://localhost:3000/change-password', {
      query: {
        email: user.email,
        message: 'Please change your temporary password'
      }
    });
  }
  
  // Check for exam mode (ephemeral session)
  const examMode = context.request.query?.exam_mode === 'true';
  
  if (examMode) {
    // Set ephemeral session for exams
    api.session.setCookieMode({ persistent: false });
    
    // Short session lifetime (30 minutes)
    const examTimeout = 30 * 60 * 1000;
    api.session.setIdleExpiresAt(Date.now() + examTimeout);
    
    // Always require MFA for exam access
    api.multifactor.enable('any', { allowRememberBrowser: false });
    
    // Add exam mode flag to token
    api.accessToken.setCustomClaim(`${NAMESPACE}/examMode`, true);
  }
  
  // Risk-based authentication
  const { riskAssessment } = context.authentication || {};
  
  if (riskAssessment) {
    const { NewDevice, ImpossibleTravel, UntrustedIP } = riskAssessment.assessments || {};
    
    // Block high-risk logins
    if (UntrustedIP?.code === 'found_on_deny_list') {
      api.access.deny('Login blocked: IP associated with suspicious activity');
      return;
    }
    
    if (ImpossibleTravel?.code === 'impossible_travel_from_last_login') {
      api.access.deny('Login blocked: Impossible travel detected');
      return;
    }
    
    // Require MFA for new devices or low confidence
    const lowConfidence = ['low', 'medium'].includes(riskAssessment.confidence);
    const isNewDevice = NewDevice?.code === 'no_match';
    
    if ((lowConfidence || isNewDevice) && !examMode) {
      api.multifactor.enable('any', { allowRememberBrowser: true });
    }
    
    // Add risk info to token
    api.accessToken.setCustomClaim(`${NAMESPACE}/risk`, {
      level: riskAssessment.confidence,
      isNewDevice: isNewDevice
    });
  }
  
  console.log(`User login: ${user.email} (${role}) - Risk: ${riskAssessment?.confidence || 'unknown'}`);
};
