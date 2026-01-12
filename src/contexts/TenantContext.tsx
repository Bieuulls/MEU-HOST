import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: Record<string, any>;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  loading: boolean;
  setCurrentTenant: (tenant: Tenant) => void;
  userTenants: Tenant[];
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => {
    const saved = localStorage.getItem('currentTenant');
    return saved ? JSON.parse(saved) : null;
  });
  const [userTenants, setUserTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserTenants = async () => {
      if (!user) {
        setUserTenants([]);
        setCurrentTenant(null);
        setLoading(false);
        return;
      }

      try {
        // Provide a default tenant for development
        const defaultTenant: Tenant = {
          id: '1',
          name: 'Default Store',
          domain: 'localhost',
          settings: {}
        };
        const tenants: Tenant[] = [defaultTenant];
        setUserTenants(tenants);

        // If no current tenant is selected but we have tenants, select the first one
        if (!currentTenant && tenants.length > 0) {
          setCurrentTenant(tenants[0]);
        }
        // If current tenant is not in the list of available tenants, reset it
        else if (currentTenant && !tenants.find(t => t.id === currentTenant.id)) {
          setCurrentTenant(tenants[0] || null);
        }
      } catch (error) {
        console.error('Error loading tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserTenants();
  }, [user]);

  // Save current tenant to localStorage whenever it changes
  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem('currentTenant', JSON.stringify(currentTenant));
    } else {
      localStorage.removeItem('currentTenant');
    }
  }, [currentTenant]);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        loading,
        setCurrentTenant,
        userTenants
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
