import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Eye, 
  RotateCcw, 
  LogOut, 
  User, 
  Code2, 
  FolderGit2, 
  Award, 
  Link2, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  Inbox,
  Mail,
  Check,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink,
  Key,
  AlertCircle,
  Clock,
  Send,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, Certification } from '../../../server/types';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

type Tab = 'profile' | 'education' | 'skills' | 'projects' | 'certifications' | 'social' | 'inbox' | 'security';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminViewOpen, 
    setIsAdminViewOpen, 
    draftData, 
    updateDraft, 
    publishDraft, 
    resetToDefaults,
    isPreviewMode,
    setIsPreviewMode,
    logout,
    changePassword,
    uploadPhoto,
    uploadResume,
    adminUsername 
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Photo URL input state
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Messages inbox state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Modals for confirmation
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Security password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email config state
  const [emailConfig, setEmailConfig] = useState<{
    service: 'web3forms' | 'gmail' | 'smtp' | 'inbox-only';
    web3FormsKey?: string;
    gmailUser?: string;
    gmailAppPassword?: string;
    recipientEmail?: string;
  }>({
    service: 'web3forms',
    web3FormsKey: '',
    gmailUser: 'shannu0429@gmail.com',
    gmailAppPassword: '',
    recipientEmail: 'shannu0429@gmail.com',
  });
  const [isLoadingEmailConfig, setIsLoadingEmailConfig] = useState(false);
  const [isSavingEmailConfig, setIsSavingEmailConfig] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ sent: boolean; provider: string; reason?: string } | null>(null);

  // Fetch messages and email config when inbox tab is opened
  useEffect(() => {
    if (activeTab === 'inbox' && isAdminViewOpen) {
      fetchMessages();
      fetchEmailConfig();
    }
  }, [activeTab, isAdminViewOpen]);

  const fetchEmailConfig = async () => {
    setIsLoadingEmailConfig(true);
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/admin/email-config', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setEmailConfig((prev) => ({
          ...prev,
          ...data,
          service: data.service || (data.web3FormsKey ? 'web3forms' : data.gmailAppPassword ? 'gmail' : 'inbox-only'),
        }));
      }
    } catch (err) {
      console.error('Failed to load email config:', err);
    } finally {
      setIsLoadingEmailConfig(false);
    }
  };

  const handleSaveEmailConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingEmailConfig(true);
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(emailConfig),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        showNotification('success', 'Email delivery settings saved successfully!');
      } else {
        showNotification('error', resData.error || 'Failed to save email settings');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving email settings');
    } finally {
      setIsSavingEmailConfig(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setTestEmailResult(null);
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const result = await res.json();
      setTestEmailResult(result);
      if (result.sent) {
        showNotification('success', `Test email sent successfully via ${result.provider}! Check your inbox.`);
      } else {
        showNotification('error', result.reason || `Test email not delivered. Reason: ${result.provider}`);
      }
    } catch (err: any) {
      setTestEmailResult({ sent: false, provider: 'Network', reason: err.message });
      showNotification('error', 'Network error triggering test email');
    } finally {
      setIsTestingEmail(false);
    }
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const token = localStorage.getItem('agy_admin_token');
      const res = await fetch('/api/admin/messages', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleMarkMessageRead = async (id: string, read: boolean) => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ read }),
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const token = localStorage.getItem('agy_admin_token');
      await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showNotification('success', 'Message deleted from inbox.');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdminViewOpen) return null;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    const res = await publishDraft();
    setIsPublishing(false);
    if (res.success) {
      showNotification('success', 'Changes published and saved persistently to storage!');
    } else {
      showNotification('error', res.error || 'Failed to save changes.');
    }
  };

  const handleReset = async () => {
    const res = await resetToDefaults();
    setShowResetConfirm(false);
    if (res.success) {
      showNotification('success', 'Portfolio reset to default configuration.');
    } else {
      showNotification('error', res.error || 'Failed to reset.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Failed to update password.' });
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    updateDraft((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  const handleApplyCustomPhotoUrl = () => {
    if (!customPhotoUrl.trim()) return;
    handleProfileChange('photoUrl', customPhotoUrl.trim());
    setCustomPhotoUrl('');
    showNotification('success', 'Profile photo URL updated in draft!');
  };

  // Projects helpers
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Project Title',
      tagline: 'Short catchy tagline',
      description: 'Describe the problem solved, architecture, and results.',
      techStack: ['Python', 'Flask'],
      githubUrl: null,
      demoUrl: null,
      featured: true,
      category: 'AI / Python',
      highlightBadge: 'New',
      previewGradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    };

    updateDraft((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const handleUpdateProject = (index: number, updated: Partial<Project>) => {
    updateDraft((prev) => {
      const projs = [...prev.projects];
      projs[index] = { ...projs[index], ...updated };
      return { ...prev, projects: projs };
    });
  };

  const handleDeleteProject = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    setProjectToDelete(null);
    showNotification('success', 'Project removed from draft.');
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    updateDraft((prev) => {
      const projs = [...prev.projects];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= projs.length) return prev;
      const temp = projs[index];
      projs[index] = projs[targetIndex];
      projs[targetIndex] = temp;
      return { ...prev, projects: projs };
    });
  };

  // Certifications helper
  const handleAddCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: 'Certificate Title',
      issuer: 'Issuing Organization',
      issueDate: '2026',
      credentialUrl: '',
      description: 'Key skills covered in this certification.',
    };

    updateDraft((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  };

  const handleUpdateCertification = (index: number, updated: Partial<Certification>) => {
    updateDraft((prev) => {
      const certs = [...prev.certifications];
      certs[index] = { ...certs[index], ...updated };
      return { ...prev, certifications: certs };
    });
  };

  const handleDeleteCertification = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050814]/95 backdrop-blur-xl text-slate-100 overflow-hidden animate-fadeIn">
      
      {/* Top Navigation Bar */}
      <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold font-mono">
            SS
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center space-x-2">
              <span>Portfolio Studio</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Logged in as {adminUsername}
              </span>
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Preview Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
              isPreviewMode
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'glass-card text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPreviewMode ? 'Preview Mode Active' : 'Preview Mode'}</span>
          </button>

          {/* Publish Changes */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold font-mono text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>

          {/* Reset Defaults */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
            title="Reset to default baseline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close / Minimize Dashboard */}
          <button
            onClick={() => setIsAdminViewOpen(false)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Close dashboard"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-300 hover:bg-white/5 transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className={`px-6 py-2.5 text-xs font-mono flex items-center justify-between border-b ${
          notification.type === 'success'
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            : 'bg-red-950/80 text-red-300 border-red-500/40'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Tabs */}
        <aside className="w-56 border-r border-white/10 bg-black/20 p-4 space-y-1 shrink-0 overflow-y-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'profile'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'education'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Education</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'skills'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Skills & Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'projects'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects ({draftData.projects?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'certifications'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates ({draftData.certifications?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'inbox'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Inbox className="w-4 h-4" />
              <span>Messages</span>
            </div>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'social'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Links & Résumé</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security</span>
          </button>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* TAB: PROFILE & PHOTO STUDIO */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Profile & Photo Studio</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Change your profile photograph, title, career goals, and hero introduction.
                  </p>
                </div>

                {/* Photo Studio Card */}
                <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Profile Photograph Manager</h3>
                      <p className="text-xs text-slate-400">Change your portrait with instant preview</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                    {/* Live Preview Thumbnail */}
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20 shrink-0">
                      <img
                        src={draftData.profile.photoUrl}
                        alt="Current preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-[10px] font-mono text-center text-cyan-300 py-0.5">
                        Live Preview
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 w-full">
                      {/* Upload Local File */}
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1">
                          Upload New Image File (JPG, PNG, WebP)
                        </label>
                        <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 text-xs font-mono transition">
                          <Upload className="w-4 h-4" />
                          <span>Browse & Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const res = await uploadPhoto(file);
                                if (res.success) {
                                  showNotification('success', 'Profile photo updated and saved!');
                                } else {
                                  showNotification('error', res.error || 'Failed to upload photo.');
                                }
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Or Enter Custom Image URL */}
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1">
                          Or Set Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://example.com/your-photo.jpg"
                            value={customPhotoUrl}
                            onChange={(e) => setCustomPhotoUrl(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustomPhotoUrl}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition"
                          >
                            Apply URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-slate-300">Display Full Name</label>
                      <input
                        type="text"
                        value={draftData.profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-slate-300">Preferred Name</label>
                      <input
                        type="text"
                        value={draftData.profile.preferredName}
                        onChange={(e) => handleProfileChange('preferredName', e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300">Professional Title</label>
                    <input
                      type="text"
                      value={draftData.profile.title}
                      onChange={(e) => handleProfileChange('title', e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300">Career Goal & Internship Focus</label>
                    <textarea
                      rows={2}
                      value={draftData.profile.careerGoal}
                      onChange={(e) => handleProfileChange('careerGoal', e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300">Hero Section Short Introduction</label>
                    <textarea
                      rows={3}
                      value={draftData.profile.heroIntro}
                      onChange={(e) => handleProfileChange('heroIntro', e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300">About Me — Overview</label>
                    <textarea
                      rows={4}
                      value={draftData.profile.about.overview}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraft((prev) => ({
                          ...prev,
                          profile: {
                            ...prev.profile,
                            about: { ...prev.profile.about, overview: val },
                          },
                        }));
                      }}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Education & Academics</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Update college, degree, branch, current standing, and academic highlights.
                  </p>
                </div>

                <div className="space-y-6">
                  {draftData.education?.map((item, eduIdx) => (
                    <div key={item.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-300">College / Institution</label>
                          <input
                            type="text"
                            value={item.institution}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => {
                                const edus = [...prev.education];
                                edus[eduIdx] = { ...edus[eduIdx], institution: val };
                                return { ...prev, education: edus };
                              });
                            }}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-slate-300">Degree</label>
                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => {
                                const edus = [...prev.education];
                                edus[eduIdx] = { ...edus[eduIdx], degree: val };
                                return { ...prev, education: edus };
                              });
                            }}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-300">Branch</label>
                          <input
                            type="text"
                            value={item.branch}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => {
                                const edus = [...prev.education];
                                edus[eduIdx] = { ...edus[eduIdx], branch: val };
                                return { ...prev, education: edus };
                              });
                            }}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-slate-300">Current Academic Year</label>
                          <input
                            type="text"
                            value={item.currentYear}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateDraft((prev) => {
                                const edus = [...prev.education];
                                edus[eduIdx] = { ...edus[eduIdx], currentYear: val };
                                return { ...prev, education: edus };
                              });
                            }}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-300">Description</label>
                        <textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateDraft((prev) => {
                              const edus = [...prev.education];
                              edus[eduIdx] = { ...edus[eduIdx], description: val };
                              return { ...prev, education: edus };
                            });
                          }}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: INBOX / MESSAGES */}
            {activeTab === 'inbox' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Contact Messages & Inquiries</h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Real-time submissions received through your portfolio contact form.
                    </p>
                  </div>
                  <button
                    onClick={fetchMessages}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono transition"
                  >
                    Refresh
                  </button>
                </div>

                {isLoadingMessages ? (
                  <div className="glass-card p-8 rounded-2xl border border-white/10 text-center text-xs font-mono text-slate-400">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="glass-card p-10 rounded-2xl border border-dashed border-white/15 text-center space-y-2">
                    <Mail className="w-8 h-8 text-cyan-400 mx-auto" />
                    <h3 className="text-sm font-bold text-white">Inbox is Empty</h3>
                    <p className="text-xs text-slate-400">
                      When recruiters or developers send messages through your portfolio form, they will appear right here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`glass-card p-6 rounded-2xl border transition ${
                          msg.read ? 'border-white/10 opacity-85' : 'border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div>
                            <div className="flex items-center space-x-2">
                              {!msg.read && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                              )}
                              <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                              <span className="text-xs text-cyan-300 font-mono">({msg.email})</span>
                            </div>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono transition"
                            >
                              Reply
                            </a>
                            <button
                              onClick={() => handleMarkMessageRead(msg.id, !msg.read)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                              title={msg.read ? 'Mark as unread' : 'Mark as read'}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="pt-3 space-y-2">
                          <p className="text-xs font-semibold text-slate-200">
                            Subject: <span className="font-normal text-slate-300">{msg.subject || '(No subject)'}</span>
                          </p>
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Project Management</h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Add, reorder, edit links, or remove projects. Click "Publish Live" to save.
                    </p>
                  </div>
                  <button
                    onClick={handleAddProject}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draftData.projects?.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 relative"
                    >
                      {/* Top Bar for Project Card */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                            #{idx + 1}
                          </span>
                          <span className="text-sm font-bold text-white">{proj.title}</span>
                        </div>

                        {/* Order & Delete Actions */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveProject(idx, 'up')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            disabled={idx === (draftData.projects?.length || 0) - 1}
                            onClick={() => handleMoveProject(idx, 'down')}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(proj.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-300">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleUpdateProject(idx, { title: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-slate-300">Tagline</label>
                          <input
                            type="text"
                            value={proj.tagline}
                            onChange={(e) => handleUpdateProject(idx, { tagline: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-300">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => handleUpdateProject(idx, { description: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-300">GitHub Repository URL</label>
                          <input
                            type="text"
                            placeholder="https://github.com/shannu0429-wq/..."
                            value={proj.githubUrl || ''}
                            onChange={(e) => handleUpdateProject(idx, { githubUrl: e.target.value.trim() || null })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-slate-300">Live Demo URL</label>
                          <input
                            type="text"
                            placeholder="Leave empty if not ready"
                            value={proj.demoUrl || ''}
                            onChange={(e) => handleUpdateProject(idx, { demoUrl: e.target.value.trim() || null })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-300">Tech Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={proj.techStack.join(', ')}
                          onChange={(e) => handleUpdateProject(idx, { 
                            techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) 
                          })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Skills & Technologies</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Manage your categorized skills. Toggle primary highlights for Python & Flask.
                  </p>
                </div>

                <div className="space-y-6">
                  {draftData.skills?.categories?.map((cat, catIdx) => (
                    <div key={cat.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-cyan-300 font-mono">{cat.title}</h3>
                        <span className="text-xs text-slate-400">{cat.skills.length} skills</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {cat.skills.map((skill, skillIdx) => (
                          <div
                            key={skill.name}
                            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono"
                          >
                            <span className={skill.isPrimary ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                              {skill.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                updateDraft((prev) => {
                                  const cats = [...prev.skills.categories];
                                  const c = { ...cats[catIdx] };
                                  const sks = [...c.skills];
                                  sks[skillIdx] = { ...sks[skillIdx], isPrimary: !sks[skillIdx].isPrimary };
                                  c.skills = sks;
                                  cats[catIdx] = c;
                                  return { ...prev, skills: { ...prev.skills, categories: cats } };
                                });
                              }}
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                skill.isPrimary ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-slate-400'
                              }`}
                              title="Toggle primary star"
                            >
                              ★
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateDraft((prev) => {
                                  const cats = [...prev.skills.categories];
                                  const c = { ...cats[catIdx] };
                                  c.skills = c.skills.filter((_, idx) => idx !== skillIdx);
                                  cats[catIdx] = c;
                                  return { ...prev, skills: { ...prev.skills, categories: cats } };
                                });
                              }}
                              className="text-slate-400 hover:text-red-400"
                              title="Remove skill"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add skill input */}
                      <div className="pt-2 flex items-center space-x-2">
                        <input
                          type="text"
                          id={`new-skill-${cat.id}`}
                          placeholder="Add new skill..."
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget;
                              const val = input.value.trim();
                              if (val) {
                                updateDraft((prev) => {
                                  const cats = [...prev.skills.categories];
                                  const c = { ...cats[catIdx] };
                                  c.skills = [...c.skills, { name: val }];
                                  cats[catIdx] = c;
                                  return { ...prev, skills: { ...prev.skills, categories: cats } };
                                });
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Certifications & Badges</h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Add verified certificates or course completions.
                    </p>
                  </div>
                  <button
                    onClick={handleAddCertification}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certificate</span>
                  </button>
                </div>

                {!draftData.certifications || draftData.certifications.length === 0 ? (
                  <div className="glass-card p-8 rounded-2xl border border-dashed border-white/15 text-center text-slate-400 text-xs font-mono">
                    No certifications added yet. Click "Add Certificate" to add your first credential.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {draftData.certifications.map((cert, idx) => (
                      <div key={cert.id} className="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-cyan-300">Certificate #{idx + 1}</span>
                          <button
                            onClick={() => handleDeleteCertification(cert.id)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-mono text-slate-300">Title</label>
                            <input
                              type="text"
                              value={cert.title}
                              onChange={(e) => handleUpdateCertification(idx, { title: e.target.value })}
                              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-mono text-slate-300">Issuer</label>
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => handleUpdateCertification(idx, { issuer: e.target.value })}
                              className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-mono text-slate-300">Credential URL</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={cert.credentialUrl || ''}
                            onChange={(e) => handleUpdateCertification(idx, { credentialUrl: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: MESSAGES & EMAIL DELIVERY */}
            {activeTab === 'inbox' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                      <Inbox className="w-5 h-5 text-cyan-400" />
                      <span>Messages & Email Delivery</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      View visitor contact messages and manage external email forwarding to shannu0429@gmail.com
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        fetchMessages();
                        fetchEmailConfig();
                      }}
                      disabled={isLoadingMessages || isLoadingEmailConfig}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition"
                      title="Refresh messages and status"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Email Delivery Configuration Card */}
                <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Direct Email Forwarding</h3>
                        <p className="text-xs text-slate-400">Forward contact form submissions directly to your personal Gmail inbox</p>
                      </div>
                    </div>

                    <div>
                      {emailConfig.web3FormsKey ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Web3Forms Active</span>
                        </span>
                      ) : emailConfig.gmailAppPassword ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Gmail SMTP Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>Studio Inbox Only (No Gmail Forwarding)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provider Selector Tabs */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEmailConfig((prev) => ({ ...prev, service: 'web3forms' }))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono transition border ${
                        emailConfig.service === 'web3forms'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold shadow-[0_0_15px_rgba(0,242,254,0.15)]'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Web3Forms API (Recommended • 10-Second Setup)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailConfig((prev) => ({ ...prev, service: 'gmail' }))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono transition border ${
                        emailConfig.service === 'gmail'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/50 font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Gmail SMTP (Google App Password)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailConfig((prev) => ({ ...prev, service: 'inbox-only' }))}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono transition border ${
                        emailConfig.service === 'inbox-only'
                          ? 'bg-white/20 text-white border-white/40 font-bold'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      Studio Inbox Only
                    </button>
                  </div>

                  {/* Web3Forms Setup Section */}
                  {emailConfig.service === 'web3forms' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 space-y-2">
                        <div className="font-bold text-cyan-300 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4" />
                          <span>How to get your free Web3Forms Access Key (Takes 30 seconds):</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                          <li>
                            Open{' '}
                            <a
                              href="https://web3forms.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 underline font-semibold hover:text-cyan-300 inline-flex items-center space-x-0.5"
                            >
                              <span>web3forms.com</span>
                              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                            </a>{' '}
                            in a new tab.
                          </li>
                          <li>
                            Enter your email: <strong className="text-white font-mono">shannu0429@gmail.com</strong> and click <strong className="text-cyan-300">"Create Access Key"</strong>.
                          </li>
                          <li>
                            Open your Gmail, copy the key you received, and paste it into the field below.
                          </li>
                          <li>
                            Click <strong className="text-cyan-300">"Save Email Settings"</strong>, then click <strong className="text-cyan-300">"Send Test Verification Email"</strong> to confirm delivery!
                          </li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                            <span>Web3Forms Access Key</span>
                            <a
                              href="https://web3forms.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
                            >
                              <span>Get Free Key</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value={emailConfig.web3FormsKey || ''}
                            onChange={(e) => setEmailConfig((prev) => ({ ...prev, web3FormsKey: e.target.value.trim() }))}
                            className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-slate-300">Recipient Email (Where inquiries are sent)</label>
                          <input
                            type="email"
                            value={emailConfig.recipientEmail || 'shannu0429@gmail.com'}
                            onChange={(e) => setEmailConfig((prev) => ({ ...prev, recipientEmail: e.target.value.trim() }))}
                            className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gmail SMTP Setup Section */}
                  {emailConfig.service === 'gmail' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-2">
                        <div className="font-bold text-purple-300 flex items-center space-x-1.5">
                          <Key className="w-4 h-4" />
                          <span>How to create a Google App Password for direct sending:</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                          <li>Make sure 2-Step Verification is enabled in your Google Account.</li>
                          <li>
                            Go to{' '}
                            <a
                              href="https://myaccount.google.com/apppasswords"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 underline font-semibold hover:text-purple-300 inline-flex items-center space-x-0.5"
                            >
                              <span>Google App Passwords</span>
                              <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                            </a>
                            .
                          </li>
                          <li>Type app name "Portfolio" and click "Create".</li>
                          <li>Copy the 16-character password and paste it below.</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-300">Gmail Address</label>
                          <input
                            type="email"
                            value={emailConfig.gmailUser || 'shannu0429@gmail.com'}
                            onChange={(e) => setEmailConfig((prev) => ({ ...prev, gmailUser: e.target.value.trim() }))}
                            className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono text-slate-300">Google App Password (16 characters)</label>
                          <input
                            type="password"
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={emailConfig.gmailAppPassword || ''}
                            onChange={(e) => setEmailConfig((prev) => ({ ...prev, gmailAppPassword: e.target.value }))}
                            className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inbox Only Mode */}
                  {emailConfig.service === 'inbox-only' && (
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 leading-relaxed">
                      In this mode, messages submitted via your portfolio contact form will not be emailed outward, but will be saved 100% securely and permanently in the <strong>Studio Inbox</strong> below. You can view them anytime here.
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleSaveEmailConfig}
                      disabled={isSavingEmailConfig}
                      className="px-4 py-2 rounded-xl text-xs font-bold font-mono text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:opacity-95 transition disabled:opacity-50"
                    >
                      {isSavingEmailConfig ? 'Saving Settings...' : 'Save Email Settings'}
                    </button>

                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={isTestingEmail}
                      className="px-4 py-2 rounded-xl text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-400/40 hover:bg-cyan-500/20 transition disabled:opacity-50 inline-flex items-center space-x-2"
                    >
                      <Send className={`w-3.5 h-3.5 ${isTestingEmail ? 'animate-bounce' : ''}`} />
                      <span>{isTestingEmail ? 'Sending Test Email...' : 'Send Test Verification Email'}</span>
                    </button>
                  </div>

                  {/* Test Email Result Banner */}
                  {testEmailResult && (
                    <div
                      className={`p-4 rounded-xl text-xs font-mono leading-relaxed border ${
                        testEmailResult.sent
                          ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50'
                          : 'bg-amber-950/80 text-amber-200 border-amber-500/50'
                      }`}
                    >
                      <div className="font-bold flex items-center space-x-2 mb-1">
                        {testEmailResult.sent ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Verification Email Delivered via {testEmailResult.provider}!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            <span>Email Not Forwarded ({testEmailResult.provider})</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {testEmailResult.sent
                          ? 'A test email was successfully sent to shannu0429@gmail.com. Please check your Gmail Inbox (or Spam/Promotions tab). Real-time forwarding is now verified and active!'
                          : testEmailResult.reason || 'Check your API key or App Password settings.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Studio Inbox: Received Messages */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <span>Studio Inbox Messages</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          {messages.length} total • {unreadCount} unread
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        All contact submissions are persistently archived on your server.
                      </p>
                    </div>
                  </div>

                  {isLoadingMessages ? (
                    <div className="glass-card p-12 text-center text-xs font-mono text-slate-400 border border-white/10 rounded-2xl">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400 mb-2" />
                      <span>Loading messages...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="glass-card p-12 text-center text-xs font-mono text-slate-400 border border-dashed border-white/15 rounded-2xl space-y-2">
                      <Inbox className="w-8 h-8 mx-auto text-slate-600" />
                      <p>Your Studio Inbox is empty. When someone submits the contact form, it will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`glass-card p-5 rounded-2xl border transition ${
                            !msg.read ? 'border-cyan-500/50 bg-cyan-950/10' : 'border-white/10'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-3">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  !msg.read ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.8)]' : 'bg-slate-600'
                                }`}
                              />
                              <div>
                                <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs text-cyan-400 hover:underline font-mono"
                                >
                                  {msg.email}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span>{new Date(msg.createdAt).toLocaleString()}</span>
                              </div>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  !msg.read
                                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40'
                                    : 'bg-white/5 text-slate-400'
                                }`}
                              >
                                {!msg.read ? 'UNREAD' : 'READ'}
                              </span>
                            </div>
                          </div>

                          {msg.subject && (
                            <div className="pt-3 text-xs font-semibold text-slate-200">
                              Subject: <span className="text-white">{msg.subject}</span>
                            </div>
                          )}

                          <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
                            <button
                              type="button"
                              onClick={() => handleMarkMessageRead(msg.id, !msg.read)}
                              className="text-slate-400 hover:text-cyan-300 transition inline-flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{msg.read ? 'Mark as Unread' : 'Mark as Read'}</span>
                            </button>

                            <div className="flex items-center space-x-3">
                              <a
                                href={`mailto:${msg.email}?subject=${encodeURIComponent(
                                  `Re: ${msg.subject || 'Portfolio Inquiry'}`
                                )}`}
                                className="text-cyan-400 hover:text-cyan-300 transition inline-flex items-center space-x-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply via Email</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-red-400 hover:text-red-300 transition inline-flex items-center space-x-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: LINKS & MEDIA */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Social Links & Résumé</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Upload your résumé PDF and manage public contact links.
                  </p>
                </div>

                {/* Resume Upload Box */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Official Résumé PDF</span>
                    </h3>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 self-start sm:self-auto">
                      {draftData.profile.resumeAvailable ? '● Direct PDF Download Active' : '● "Uploading in few days" Notice Active'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Until you upload your official PDF below, visitors who click "Résumé" across your site will see a polished message stating: <strong className="text-cyan-300">"Uploading revised version in a few days"</strong> with options to request an immediate copy via email.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/40 hover:bg-purple-500/30 text-xs font-mono transition">
                      <Upload className="w-4 h-4" />
                      <span>Upload / Replace Résumé PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const res = await uploadResume(file);
                            if (res.success) {
                              showNotification('success', 'Résumé PDF uploaded and activated!');
                            } else {
                              showNotification('error', res.error || 'Failed to upload résumé.');
                            }
                          }
                        }}
                      />
                    </label>

                    {draftData.profile.resumeAvailable && (
                      <button
                        type="button"
                        onClick={() => {
                          updateDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, resumeAvailable: false },
                          }));
                          showNotification('success', 'Switched to "Uploading in a few days" visitor notice. Remember to click "Publish Live".');
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        Switch to "Uploading in a few days" Notice
                      </button>
                    )}
                  </div>
                </div>

                {/* Social URL links */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white">Public Links</h3>
                  {draftData.socialLinks?.map((link, idx) => (
                    <div key={link.id} className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">{link.name} URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateDraft((prev) => {
                            const links = [...prev.socialLinks];
                            links[idx] = { ...links[idx], url: val };
                            return { ...prev, socialLinks: links };
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECURITY & AUTH */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Security & Password</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Change your admin credentials. Password updates will be saved to your server configuration.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 max-w-md space-y-4">
                  {passwordMsg && (
                    <div className={`p-3 rounded-xl text-xs font-mono ${
                      passwordMsg.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {passwordMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="text-xs font-mono text-slate-300">Current Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300">New Password (min 8 chars)</label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm outline-none focus:border-cyan-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:opacity-95 transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-2xl max-w-sm w-full border border-red-500/40 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Delete Project?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this project? This change will take effect once you publish live.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => handleDeleteProject(projectToDelete)}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-6 rounded-2xl max-w-sm w-full border border-yellow-500/40 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Reset to Baseline?</h3>
            <p className="text-xs text-slate-300">
              This will reset all your portfolio content back to the initial confirmed setup.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs"
              >
                Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
