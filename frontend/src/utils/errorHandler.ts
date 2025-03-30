export const handleApiError = (error: any): string => {
  console.error("API Error:", error);

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);

    // Return the message from API if available
    if (error.response.data && error.response.data.message) {
      return error.response.data.message;
    }

    // Generic error based on status code
    if (error.response.status === 401) {
      return "Authentication failed. Please login again.";
    } else if (error.response.status === 403) {
      return "You do not have permission to perform this action.";
    } else if (error.response.status === 404) {
      return "Resource not found.";
    } else if (error.response.status >= 500) {
      return "Server error. Please try again later.";
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
    return "No response from server. Please check your internet connection.";
  }

  // Something happened in setting up the request that triggered an Error
  return error.message || "An unknown error occurred";
};
