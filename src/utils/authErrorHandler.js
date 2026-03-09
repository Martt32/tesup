export const getAuthErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
  
      case "auth/invalid-email":
        return "Please enter a valid email address.";
  
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
  
      case "auth/user-not-found":
        return "No account found with this email.";
  
      case "auth/wrong-password":
        return "Incorrect password.";
  
      case "auth/invalid-credential":
          return "Incorrect email or password.";  

      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
  
      case "auth/network-request-failed":
        return "Network error. Check your connection.";
  
      case "auth/operation-not-allowed":
        return "This authentication method is not enabled.";
  
      default:
        return "Something went wrong. Please try again.";
    }
  };