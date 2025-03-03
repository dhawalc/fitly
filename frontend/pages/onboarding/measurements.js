import { AuthService } from "../../services/auth-service";

const handleSubmit = (e) => {
  e.preventDefault();
  
  // Update user data with form data
  const updatedUserData = {
    ...userData,
    bodyFat: parseFloat(formData.bodyFat) || null,
    measurements: {
      chest: parseFloat(formData.chest) || null,
      waist: parseFloat(formData.waist) || null,
      hips: parseFloat(formData.hips) || null,
      arms: parseFloat(formData.arms) || null,
      thighs: parseFloat(formData.thighs) || null
    }
  };
  
  // Save updated user data
  AuthService.updateUserProfile(updatedUserData);
  
  // Set onboarding step to 'complete' instead of a number
  localStorage.setItem('onboardingStep', 'complete');
  
  // Navigate to next step
  router.push('/onboarding/complete');
}; 