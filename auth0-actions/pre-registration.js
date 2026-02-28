/**
 * Auth0 Pre-Registration Action
 * 
 * This action runs before a user is created.
 * Used to validate and auto-populate user data.
 * 
 * Install in Auth0 Dashboard: Actions > Library > Build Custom > Pre-Registration
 */

exports.onExecutePreUserRegistration = async ({ user, context, api }) => {
  // Validate email domain
  const allowedDomains = [
    'aot.edu.in',
    'iemcal.com',
    'yourcollege.edu'
  ];
  
  const emailDomain = user.email?.split('@')[1];
  
  if (!allowedDomains.includes(emailDomain)) {
    api.validation.error('Email must be from an allowed institution domain');
    return;
  }
  
  // Auto-populate user metadata from email if not provided
  if (!user.user_metadata) {
    user.user_metadata = {};
  }
  
  // Extract name from email if not provided
  if (!user.user_metadata.firstName && user.email) {
    const emailPart = user.email.split('@')[0];
    const nameParts = emailPart.split('.');
    if (nameParts.length >= 2) {
      user.user_metadata.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      user.user_metadata.lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
    }
  }
  
  // Set default role
  if (!user.user_metadata.role) {
    user.user_metadata.role = 'student';
  }
  
  // Require password change on first login
  user.user_metadata.mustChangePassword = true;
  
  console.log(`Pre-registration validation passed for: ${user.email}`);
};
