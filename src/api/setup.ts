export const checkSetupStatus = async (): Promise<{
  completed: boolean;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/setup/status');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check setup status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking setup status:', error);
    return { completed: false };
  }
};

export const initializeSetup = async (adminData: {
  name: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/setup/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...adminData,
        role: 'admin',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Setup initialization failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Setup initialization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during setup',
    };
  }
};