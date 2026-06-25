import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Users, Trophy, Image, Settings,
  Save, Plus, Trash2, Upload, LogOut, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getProfile, updateProfile, getSocialLinks, updateSocialLinks,
  getFriends, addFriend, updateFriend, deleteFriend,
  getClan, updateClan, getSquad, updateSquad,
  getGallery, addGalleryImage, deleteGalleryImage,
  getSettings, updateSettings, uploadImage, initializeDefaultData
} from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, ClanData, SquadData, GalleryImage, SiteSettings } from '../types';
import GlassCard from '../components/ui/GlassCard';
// Admin page animations

type AdminTab = 'profile' | 'friends' | 'clan' | 'squad' | 'gallery' | 'social' | 'settings';

const tabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'clan', label: 'Clan', icon: Trophy },
  { id: 'squad', label: 'Squad', icon: Users },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'social', label: 'Social', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Data states
  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [social, setSocial] = useState<Partial<SocialLinks>>({});
  const [friends, setFriends] = useState<Friend[]>([]);
  const [clan, setClan] = useState<Partial<ClanData>>({});
  const [squad, setSquad] = useState<Partial<SquadData>>({});
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});

  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [showFriendForm, setShowFriendForm] = useState(false);
  const [friendForm, setFriendForm] = useState<Partial<Friend>>({});

  const [, setUploading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    try {
      await initializeDefaultData();
      const [p, s, f, c, sq, g, st] = await Promise.all([
        getProfile(), getSocialLinks(), getFriends(),
        getClan(), getSquad(), getGallery(), getSettings()
      ]);
      if (p) setProfile(p);
      if (s) setSocial(s);
      if (f) setFriends(f);
      if (c) setClan(c);
      if (sq) setSquad(sq);
      if (g) setGallery(g);
      if (st) setSettings(st);
    } catch (e) {
      console.error(e);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profile);
      showMessage('Profile saved!');
    } catch (e) {
      showMessage('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      await updateSocialLinks(social);
      showMessage('Social links saved!');
    } catch (e) {
      showMessage('Error saving social links');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClan = async () => {
    setSaving(true);
    try {
      await updateClan(clan);
      showMessage('Clan saved!');
    } catch (e) {
      showMessage('Error saving clan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSquad = async () => {
    setSaving(true);
    try {
      await updateSquad(squad);
      showMessage('Squad saved!');
    } catch (e) {
      showMessage('Error saving squad');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showMessage('Settings saved!');
    } catch (e) {
      showMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, path);
      if (field.startsWith('profile.')) {
        setProfile(prev => ({ ...prev, [field.replace('profile.', '')]: url }));
      } else if (field.startsWith('clan.')) {
        setClan(prev => ({ ...prev, [field.replace('clan.', '')]: url }));
      }
      showMessage('Image uploaded!');
    } catch (e) {
      showMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!friendForm.ign) {
      showMessage('IGN is required');
      return;
    }
    setSaving(true);
    try {
      await addFriend(friendForm as Omit<Friend, 'id'>);
      setShowFriendForm(false);
      setFriendForm({});
      const updated = await getFriends();
      setFriends(updated);
      showMessage('Friend added!');
    } catch (e) {
      showMessage('Error adding friend');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFriend = async () => {
    if (!editingFriend) return;
    setSaving(true);
    try {
      await updateFriend(editingFriend.id, friendForm);
      setEditingFriend(null);
      setFriendForm({});
      const updated = await getFriends();
      setFriends(updated);
      showMessage('Friend updated!');
    } catch (e) {
      showMessage('Error updating friend');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFriend = async (id: string) => {
    if (!confirm('Delete this friend?')) return;
    try {
      await deleteFriend(id);
      setFriends(prev => prev.filter(f => f.id !== id));
      showMessage('Friend deleted');
    } catch (e) {
      showMessage('Error deleting friend');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `gallery/${Date.now()}_${file.name}`);
      await addGalleryImage({ url, caption: file.name, date: new Date().toISOString().split('T')[0] });
      const updated = await getGallery();
      setGallery(updated);
      showMessage('Image added!');
    } catch (e) {
      showMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteGalleryImage(id);
      setGallery(prev => prev.filter(g => g.id !== id));
      showMessage('Image deleted');
    } catch (e) {
      showMessage('Error deleting image');
    }
  };

  const openEditFriend = (friend: Friend) => {
    setEditingFriend(friend);
    setFriendForm({ ...friend });
    setShowFriendForm(true);
  };

  const openAddFriend = () => {
    setEditingFriend(null);
    setFriendForm({});
    setShowFriendForm(true);
  };

  if (!isAdmin) return null;

  const inputClass = "w-full px-3 py-2.5 input-gaming rounded-xl text-sm";
  const labelClass = "text-xs text-[#94A3B8] mb-1 block";

  return (
    <div className="pb-24 pt-16 px-5 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white font-gaming">Admin Panel</h1>
            <p className="text-xs text-[#94A3B8]">Manage your vault</p>
          </div>
          <button onClick={() => logout()} className="w-10 h-10 glass-card flex items-center justify-center">
            <LogOut className="w-4 h-4 text-[#94A3B8]" />
          </button>
        </div>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs"
        >
          {message}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                  : 'bg-[#111827]/60 text-[#94A3B8] border border-[#00F0FF]/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Profile Photo</label>
                  <div className="flex items-center gap-3">
                    {profile.profilePhoto && <img src={profile.profilePhoto} className="w-12 h-12 rounded-xl object-cover" />}
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, `profile/photo_${Date.now()}`, 'profile.profilePhoto')} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Cover Banner</label>
                  <div className="flex items-center gap-3">
                    {profile.coverBanner && <img src={profile.coverBanner} className="w-20 h-12 rounded-xl object-cover" />}
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, `profile/banner_${Date.now()}`, 'profile.coverBanner')} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Hero Background</label>
                  <div className="flex items-center gap-3">
                    {profile.heroBackground && <img src={profile.heroBackground} className="w-20 h-12 rounded-xl object-cover" />}
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, `profile/hero_${Date.now()}`, 'profile.heroBackground')} />
                    </label>
                  </div>
                </div>
                {[
                  ['Real Name', 'realName', 'text'],
                  ['In-Game Name', 'ign', 'text'],
                  ['BGMI ID', 'bgmiId', 'text'],
                  ['Collection Level', 'collectionLevel', 'number'],
                  ['Account Level', 'accountLevel', 'number'],
                  ['Popularity', 'popularity', 'number'],
                  ['Likes', 'likes', 'number'],
                  ['Current Tier', 'currentTier', 'text'],
                  ['Highest Tier', 'highestTier', 'text'],
                  ['Favorite Weapon', 'favoriteWeapon', 'text'],
                  ['Favorite Map', 'favoriteMap', 'text'],
                  ['Favorite Mode', 'favoriteMode', 'text'],
                  ['Playing Since', 'playingSince', 'text'],
                  ['Country', 'country', 'text'],
                  ['State', 'state', 'text'],
                ].map(([label, field, type]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input
                      type={type as string}
                      value={(profile as any)[field] || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                ))}
                <div>
                  <label className={labelClass}>About Me</label>
                  <textarea
                    value={profile.aboutMe || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, aboutMe: e.target.value }))}
                    className={`${inputClass} min-h-[100px] resize-none`}
                  />
                </div>
                <button onClick={handleSaveProfile} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <motion.div key="friends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#00F0FF] font-gaming">Friends ({friends.length})</h3>
              <button onClick={openAddFriend} className="flex items-center gap-2 px-3 py-1.5 rounded-xl btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" />
                Add Friend
              </button>
            </div>

            {showFriendForm && (
              <GlassCard className="p-4 mb-4">
                <h4 className="text-sm font-bold text-white mb-3">{editingFriend ? 'Edit Friend' : 'Add Friend'}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Real Name', 'realName', 'text'],
                    ['IGN', 'ign', 'text'],
                    ['BGMI ID', 'bgmiId', 'text'],
                    ['Collection Level', 'collectionLevel', 'number'],
                    ['Account Level', 'accountLevel', 'number'],
                    ['Synergy', 'synergy', 'number'],
                    ['Friend Since', 'friendSince', 'text'],
                    ['Favorite Weapon', 'favoriteWeapon', 'text'],
                    ['Favorite Map', 'favoriteMap', 'text'],
                    ['Favorite Mode', 'favoriteMode', 'text'],
                  ].map(([label, field, type]) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type={type as string}
                        value={(friendForm as any)[field] || ''}
                        onChange={(e) => setFriendForm(prev => ({ ...prev, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className={labelClass}>Notes</label>
                    <textarea
                      value={friendForm.notes || ''}
                      onChange={(e) => setFriendForm(prev => ({ ...prev, notes: e.target.value }))}
                      className={`${inputClass} min-h-[60px] resize-none`}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setShowFriendForm(false)} className="flex-1 py-2 rounded-xl bg-[#111827]/60 text-[#94A3B8] text-xs border border-[#00F0FF]/10">
                    Cancel
                  </button>
                  <button
                    onClick={editingFriend ? handleUpdateFriend : handleAddFriend}
                    disabled={saving}
                    className="flex-1 py-2 rounded-xl btn-primary text-xs font-medium"
                  >
                    {saving ? 'Saving...' : editingFriend ? 'Update' : 'Add'}
                  </button>
                </div>
              </GlassCard>
            )}

            <div className="space-y-2">
              {friends.map(friend => (
                <GlassCard key={friend.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00F0FF]/20">
                      {friend.profilePhoto ? (
                        <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{friend.ign}</p>
                      <p className="text-[10px] text-[#94A3B8]">{friend.synergy} SYN</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditFriend(friend)} className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center">
                        <Settings className="w-3.5 h-3.5 text-[#00F0FF]" />
                      </button>
                      <button onClick={() => handleDeleteFriend(friend.id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Clan Tab */}
        {activeTab === 'clan' && (
          <motion.div key="clan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Clan Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Clan Logo</label>
                  <div className="flex items-center gap-3">
                    {clan.logo && <img src={clan.logo} className="w-12 h-12 rounded-xl object-cover" />}
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, `clan/logo_${Date.now()}`, 'clan.logo')} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Clan Name</label>
                  <input type="text" value={clan.name || ''} onChange={(e) => setClan(prev => ({ ...prev, name: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Members</label>
                  <input type="number" value={clan.members || 0} onChange={(e) => setClan(prev => ({ ...prev, members: parseInt(e.target.value) || 0 }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={clan.description || ''} onChange={(e) => setClan(prev => ({ ...prev, description: e.target.value }))} className={`${inputClass} min-h-[80px] resize-none`} />
                </div>
                <button onClick={handleSaveClan} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Clan'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Squad Tab */}
        {activeTab === 'squad' && (
          <motion.div key="squad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Squad Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Squad Name</label>
                  <input type="text" value={squad.name || ''} onChange={(e) => setSquad(prev => ({ ...prev, name: e.target.value }))} className={inputClass} />
                </div>
                <button onClick={handleSaveSquad} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Squad'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#00F0FF] font-gaming">Gallery ({gallery.length})</h3>
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl btn-primary text-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map(img => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-[#00F0FF]/10 group">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteGallery(img.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Social Links</h3>
              <div className="space-y-4">
                {[
                  ['Instagram', 'instagram'],
                  ['YouTube', 'youtube'],
                  ['Facebook', 'facebook'],
                  ['Discord', 'discord'],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input
                      type="text"
                      value={(social as any)[field] || ''}
                      onChange={(e) => setSocial(prev => ({ ...prev, [field]: e.target.value }))}
                      className={inputClass}
                      placeholder={`https://...`}
                    />
                  </div>
                ))}
                <button onClick={handleSaveSocial} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Site Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Site Name</label>
                  <input type="text" value={settings.siteName || ''} onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Loading Text</label>
                  <input type="text" value={settings.loadingText || ''} onChange={(e) => setSettings(prev => ({ ...prev, loadingText: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Loading Subtitle</label>
                  <input type="text" value={settings.loadingSubtitle || ''} onChange={(e) => setSettings(prev => ({ ...prev, loadingSubtitle: e.target.value }))} className={inputClass} />
                </div>
                <button onClick={handleSaveSettings} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
