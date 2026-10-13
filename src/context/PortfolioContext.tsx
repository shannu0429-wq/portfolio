import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioState } from '../../server/types';

import { profileData as defaultProfile } from '../data/profile';
import { skillCategories as defaultSkills, currentlyLearning as defaultLearning } from '../data/skills';
import { projectsData as defaultProjects } from '../data/projects';
import { educationData as defaultEducation } from '../data/education';
import { certificationsData as defaultCertifications } from '../data/certifications';
import { socialLinks as defaultSocial } from '../data/socialLinks';

interface PortfolioContextType {
  data: PortfolioState;
  draftData: PortfolioState;
  isPreviewMode: boolean;
  isAdminLoggedIn: boolean;
  isAdminViewOpen: boolean;
  isLoginModalOpen: boolean;
  isResumeModalOpen: boolean;
  adminUsername: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setIsLoginModalOpen: (open: boolean) => void;
  setIsResumeModalOpen: (open: boolean) => void;
  setIsAdminViewOpen: (open: boolean) => void;
  setIsPreviewMode: (preview: boolean) => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateDraft: (updater: (prev: PortfolioState) => PortfolioState) => void;
  publishDraft: () => Promise<{ success: boolean; error?: string }>;
  discardDraft: () => void;
  resetToDefaults: () => Promise<{ success: boolean; error?: string }>;
  uploadPhoto: (file: File) => Promise<{ success: boolean; photoUrl?: string; error?: string }>;
  uploadResume: (file: File) => Promise<{ success: boolean; resumeUrl?: string; error?: string }>;
}

const defaultState: PortfolioState = {
  profile: defaultProfile,
  skills: {
    categories: defaultSkills,
    currentlyLearning: defaultLearning,
  },
  projects: defaultProjects,
  education: defaultEducation,
  certifications: defaultCertifications,
  socialLinks: defaultSocial,
  lastUpdated: new Date().toISOString(),
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioState>(defaultState);
  const [draftData, setDraftData] = useState<PortfolioState>(defaultState);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  // Keyboard shortcut listener: Ctrl + Shift + A to open Admin Login or toggle Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminViewOpen((prev) => !prev);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Initial Fetch: Load public portfolio data & check authentication status
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch public portfolio data
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const fetched = await res.json();
          setData(fetched);
          setDraftData(fetched);
        }
      } catch (err) {
        console.warn('Backend /api/portfolio not reached. Using local baseline data.', err);
      }

      // 2. Check auth session
      try {
        const token = localStorage.getItem('agy_admin_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const authRes = await fetch('/api/auth/me', { headers });
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated) {
            setIsAdminLoggedIn(true);
            setAdminUsername(authData.username);
          }
        }
      } catch (_) {
        // Not authenticated
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Login handler
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Authentication failed' };
      }

      if (resData.token) {
        localStorage.setItem('agy_admin_token', resData.token);
      }

      setIsAdminLoggedIn(true);
      setAdminUsername(username);
      setIsLoginModalOpen(false);
      setIsAdminViewOpen(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    localStorage.removeItem('agy_admin_token');
    setIsAdminLoggedIn(false);
    setAdminUsername(null);
    setIsAdminViewOpen(false);
    setIsPreviewMode(false);
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to update password' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error updating password' };
    }
  };

  // Update draft in-memory
  const updateDraft = (updater: (prev: PortfolioState) => PortfolioState) => {
    setDraftData((prev) => updater(prev));
  };

  // Publish draft changes to backend storage
  const publishDraft = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(draftData),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to publish changes' };
      }

      setData(resData.data || draftData);
      setDraftData(resData.data || draftData);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error publishing updates' };
    }
  };

  // Discard draft
  const discardDraft = () => {
    setDraftData(data);
  };

  // Reset to initial baseline
  const resetToDefaults = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to reset portfolio' };
      }

      setData(resData.data);
      setDraftData(resData.data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error resetting portfolio' };
    }
  };

  // Upload photo
  const uploadPhoto = async (file: File): Promise<{ success: boolean; photoUrl?: string; error?: string }> => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to upload photo' };
      }

      // Update both draft and active state
      const newUrl = resData.photoUrl;
      setDraftData((prev) => ({
        ...prev,
        profile: { ...prev.profile, photoUrl: newUrl },
      }));
      setData((prev) => ({
        ...prev,
        profile: { ...prev.profile, photoUrl: newUrl },
      }));

      return { success: true, photoUrl: newUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error uploading photo' };
    }
  };

  // Upload resume
  const uploadResume = async (file: File): Promise<{ success: boolean; resumeUrl?: string; error?: string }> => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetch('/api/admin/upload-resume', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Failed to upload résumé' };
      }

      const newUrl = resData.resumeUrl;
      setDraftData((prev) => ({
        ...prev,
        profile: { ...prev.profile, resumeAvailable: true, resumeUrl: newUrl },
      }));
      setData((prev) => ({
        ...prev,
        profile: { ...prev.profile, resumeAvailable: true, resumeUrl: newUrl },
      }));

      return { success: true, resumeUrl: newUrl };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error uploading résumé' };
    }
  };

  // The active presentation data is draftData if preview mode is on, else data
  const activeData = isPreviewMode ? draftData : data;

  return (
    <PortfolioContext.Provider
      value={{
        data: activeData,
        draftData,
        isPreviewMode,
        isAdminLoggedIn,
        isAdminViewOpen,
        isLoginModalOpen,
        isResumeModalOpen,
        adminUsername,
        isLoading,
        error,
        setIsLoginModalOpen,
        setIsResumeModalOpen,
        setIsAdminViewOpen,
        setIsPreviewMode,
        login,
        logout,
        changePassword,
        updateDraft,
        publishDraft,
        discardDraft,
        resetToDefaults,
        uploadPhoto,
        uploadResume,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
