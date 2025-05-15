import { useState, useEffect } from 'react';
import { Organization } from '../components/filtre/CompaniesFilterComponent.types';

/**
 * Error type for organization fetching
 */
export interface OrganizationError {
  message: string;
  code?: string;
  toString: () => string;
}

/**
 * Hook for fetching event organizations
 * @returns Object containing organizations, loading state, error, and refetch function
 */
export default function useEventOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<OrganizationError | null>(null);

  /**
   * Function to fetch organizations
   */
  const fetchOrganizations = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // This is a mock implementation - in a real app, you would fetch from an API
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockOrganizations: Organization[] = [
        { id: '1', name: 'Acme Inc.' },
        { id: '2', name: 'Globex Corporation' },
        { id: '3', name: 'Initech' },
        { id: '4', name: 'Stark Industries' },
        { id: '5', name: 'Wayne Enterprises' },
      ];
      
      setOrganizations(mockOrganizations);
      setLoading(false);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        toString: () => err instanceof Error ? err.toString() : 'Unknown error occurred'
      });
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    error,
    refetch: fetchOrganizations
  };
}
