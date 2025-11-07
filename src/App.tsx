import { useState, useEffect } from 'react';
import { Sparkles, CalendarDays, Video, Lightbulb, Save, FolderOpen, FileText, Bell } from 'lucide-react';
import logoIcon from './assets/logo-icon.svg';
import logo from './assets/logo.svg';
import { InputSection } from './components/InputSection';
import { CaptionSelector } from './components/CaptionSelector';
import { HashtagDisplay } from './components/HashtagDisplay';
import { PlatformPreviews } from './components/PlatformPreviews';
import { ExportSection } from './components/ExportSection';
import { BrandProfileModal } from './components/BrandProfileModal';
import { ContentHistory } from './components/ContentHistory';
import { SavedContentModal } from './components/SavedContentModal';
import { ContentPlansModal } from './components/ContentPlansModal';
import { VisualSuggestions } from './components/VisualSuggestions';
import { PostOutline } from './components/PostOutline';
import { VideoOptimizationTips } from './components/VideoOptimizationTips';
import { Calendar } from './components/Calendar';
import { ScheduleModal } from './components/ScheduleModal';
import { ScheduledPostsList } from './components/ScheduledPostsList';
import { ContentPlanGenerator } from './components/ContentPlanGenerator';
import { SmartSchedulePlanner } from './components/SmartSchedulePlanner';
import { ContentStrategySection } from './components/ContentStrategySection';
import { AlarmManager } from './components/AlarmManager';
import { AlarmModal } from './components/AlarmModal';
import { StepNavigator } from './components/StepNavigator';
import { generateContent } from './services/contentGenerator';
import { resizeImageForPlatforms } from './services/imageResizer';
import { generateVisualSuggestions, generatePostOutline } from './services/visualGenerator';
import { generateRecurringSchedule } from './services/scheduleGenerator';
import type { PlannedPost as PlannedPostServiceType } from './services/contentPlanner';
import { supabase } from './lib/supabase';
import type { GeneratedContent, ToneType, BrandProfile, ResizedImages, ContentHistory as ContentHistoryType, ScheduledPost, PlannedPost, ContentPlan, Alarm } from './types';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneType>('casual');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resizedImages, setResizedImages] = useState<ResizedImages | undefined>();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [currentDescription, setCurrentDescription] = useState('');

  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [contentHistory, setContentHistory] = useState<ContentHistoryType[]>([]);
  const [userId] = useState('demo-user-' + Math.random().toString(36).substring(7));

  const [visualSuggestions, setVisualSuggestions] = useState<ReturnType<typeof generateVisualSuggestions>>([]);
  const [postOutline, setPostOutline] = useState<ReturnType<typeof generatePostOutline> | null>(null);

  const [currentView, setCurrentView] = useState<'generator' | 'schedule' | 'strategy' | 'video'>('generator');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [showContentPlansModal, setShowContentPlansModal] = useState(false);
  const [showSmartPlanner, setShowSmartPlanner] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [plannedPosts, setPlannedPosts] = useState<PlannedPost[]>([]);
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [linkedPostForAlarm, setLinkedPostForAlarm] = useState<ScheduledPost | PlannedPost | undefined>();
  const [showSavedContentModal, setShowSavedContentModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [triggeredAlarms, setTriggeredAlarms] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBrandProfile();
    loadContentHistory();
    loadScheduledPosts();
    loadContentPlans();
    loadAlarms();

    const alarmCheckInterval = setInterval(() => {
      checkAlarms();
    }, 1000);

    return () => clearInterval(alarmCheckInterval);
  }, []);

  const checkAlarms = () => {
    const now = new Date();
    alarms.forEach((alarm) => {
      if (alarm.status === 'active' && !triggeredAlarms.has(alarm.id)) {
        const alarmTime = new Date(alarm.alarm_datetime);
        const timeDiff = alarmTime.getTime() - now.getTime();

        if (timeDiff <= 0 && timeDiff > -5000) {
          console.log('ALARM TRIGGERED:', alarm.title, alarm);
          setTriggeredAlarms((prev) => new Set(prev).add(alarm.id));
          setRingingAlarm(alarm);

          if (alarm.sound_enabled) {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvHZiTYIGGe778edTgwOUKzn77RgGwU7k9n0yHMpBSh+zPLaizsKElyx6+yhUhELSpzh8bllHAUugdDx2YYzBxdqvO/InUwNDlOu6O+yXhoEOpTX88p0KQUngM3y2Ys5CRJbr+rspFURCkud4fG5ZBsCLYHQ8dqHMwcXa7vvyp1MDQ5Tr+jvsV0aBDuU1/PKcygFKIDN8tmKOQkSW6/q7KVVEQNMV+Dxu2QcBS+B0PHahzMHF2y878qdTA0OVK/o77BdGgQ7lNfzyn4pBSiAzfLZijkJEVuw6uylVhEDTVjh8bpjHAYugdDx2ocxBxZqvO/KnksODVKt6O+xXRoEO5TX88p+KAUogM3y2Yo4AxFbsOrspVYTAkxZ4fG6YhwFLoHQ8dmHMQcWarzuyp5KDw1Srujv');
            audio.play().catch(e => console.log('Could not play sound:', e));
          }

          if (alarm.notification_enabled && 'Notification' in window) {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('Alarm: ' + alarm.title, {
                  body: alarm.notes || 'Your alarm is ringing!',
                  icon: '/logo-icon.svg'
                });
              }
            });
          }
        }
      }
    });
  };

  const loadBrandProfile = async () => {
    const { data } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setBrandProfile(data as BrandProfile);
    }
  };

  const loadContentHistory = async () => {
    const { data } = await supabase
      .from('generated_content')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setContentHistory(data as ContentHistoryType[]);
    }
  };

  const loadScheduledPosts = async () => {
    const { data, error } = await supabase.rpc('get_scheduled_posts_sg', { p_user_id: userId });

    if (error) {
      console.error('Error loading scheduled posts:', error);
      return;
    }

    if (data) {
      console.log('Loaded scheduled posts:', data);
      setScheduledPosts(data as ScheduledPost[]);
    }
  };

  const loadContentPlans = async () => {
    const [plansData, postsData] = await Promise.all([
      supabase
        .from('content_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase.rpc('get_planned_posts_sg', { p_user_id: userId })
    ]);

    if (plansData.data) {
      setContentPlans(plansData.data as ContentPlan[]);
    }
    if (postsData.data) {
      setPlannedPosts(postsData.data as PlannedPost[]);
    }
  };

  const loadAlarms = async () => {
    const { data } = await supabase
      .from('alarms')
      .select('*')
      .eq('user_id', userId)
      .order('alarm_datetime', { ascending: true });

    if (data) {
      setAlarms(data as Alarm[]);
    }
  };

  const saveBrandProfile = async (profile: Partial<BrandProfile>) => {
    if (brandProfile?.id) {
      const { data } = await supabase
        .from('brand_profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', brandProfile.id)
        .select()
        .single();

      if (data) {
        setBrandProfile(data as BrandProfile);
      }
    } else {
      const { data } = await supabase
        .from('brand_profiles')
        .insert({
          user_id: userId,
          ...profile
        })
        .select()
        .single();

      if (data) {
        setBrandProfile(data as BrandProfile);
      }
    }
  };

  const saveContentToHistory = async (
    description: string,
    content: GeneratedContent,
    imageUrl: string | null,
    resizedImages: ResizedImages | undefined
  ) => {
    await supabase
      .from('generated_content')
      .insert({
        user_id: userId,
        brand_profile_id: brandProfile?.id || null,
        description,
        formal_caption: content.formal,
        casual_caption: content.casual,
        funny_caption: content.funny,
        hashtags: content.hashtags,
        image_url: imageUrl || '',
        resized_images: resizedImages || {}
      });

    loadContentHistory();
  };

  const handleGenerate = async (companyName: string, productName: string, description: string, uploadedImageUrl: string | null, imageFile?: File) => {
    setIsGenerating(true);
    setCurrentStep(1);

    const fullDescription = `${companyName} ${productName}. ${description}`;
    setCurrentDescription(fullDescription);

    try {
      let resized: ResizedImages | undefined;

      if (imageFile) {
        resized = await resizeImageForPlatforms(imageFile);
        setResizedImages(resized as ResizedImages);
      }

      const content = await generateContent({
        companyName,
        productName,
        description
      }, brandProfile);
      setGeneratedContent(content);
      setImageUrl(uploadedImageUrl);
      setCurrentStep(2);

      const suggestions = generateVisualSuggestions(fullDescription, brandProfile);
      setVisualSuggestions(suggestions);

      const outline = generatePostOutline(fullDescription, brandProfile?.tone || 'casual', brandProfile);
      setPostOutline(outline);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTone = (tone: ToneType) => {
    setSelectedTone(tone);
  };

  const handleStepClick = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
  };

  const handleLoadContent = (content: ContentHistoryType) => {
    setGeneratedContent({
      formal: content.formal_caption,
      casual: content.casual_caption,
      funny: content.funny_caption,
      hashtags: content.hashtags
    });
    setImageUrl(content.image_url || null);
    setResizedImages(content.resized_images as ResizedImages);
    setCurrentDescription(content.description);
    setCurrentStep(2);

    const suggestions = generateVisualSuggestions(content.description, brandProfile);
    setVisualSuggestions(suggestions);

    const outline = generatePostOutline(content.description, brandProfile?.tone || 'casual', brandProfile);
    setPostOutline(outline);
  };

  const handleDeleteContent = async (id: string) => {
    await supabase
      .from('generated_content')
      .delete()
      .eq('id', id);

    loadContentHistory();
  };

  const handleSchedulePost = async (scheduleData: {
    title: string;
    scheduledDate: string;
    scheduledTime: string;
    platforms: string[];
    notes: string;
  }) => {
    if (!generatedContent) return;

    const postData = {
      user_id: userId,
      brand_profile_id: brandProfile?.id || null,
      title: scheduleData.title,
      caption: getSelectedCaption(),
      hashtags: generatedContent.hashtags,
      platforms: scheduleData.platforms,
      image_url: imageUrl || '',
      scheduled_date: scheduleData.scheduledDate,
      scheduled_time: scheduleData.scheduledTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: 'scheduled',
      notes: scheduleData.notes
    };

    console.log('Scheduling post:', postData);

    const { error } = await supabase
      .from('scheduled_posts')
      .insert(postData);

    if (error) {
      console.error('Error scheduling post:', error);
      return;
    }

    console.log('Post scheduled successfully');
    await loadScheduledPosts();
    setShowScheduleModal(false);
    setCurrentView('schedule');
  };

  const handleDeleteScheduledPost = async (id: string) => {
    await supabase
      .from('scheduled_posts')
      .delete()
      .eq('id', id);

    loadScheduledPosts();
  };

  const handleDeletePlannedPost = async (id: string) => {
    await supabase
      .from('planned_posts')
      .delete()
      .eq('id', id);

    loadContentPlans();
  };

  const handleDeletePost = async (id: string, type: 'scheduled' | 'planned') => {
    if (type === 'scheduled') {
      await handleDeleteScheduledPost(id);
    } else {
      await handleDeletePlannedPost(id);
    }
  };

  const handleEditScheduledPost = (post: ScheduledPost | PlannedPost) => {
    setEditingPost(post as ScheduledPost);
  };

  const handleDeleteContentPlan = async (id: string) => {
    await supabase
      .from('planned_posts')
      .delete()
      .eq('content_plan_id', id);

    await supabase
      .from('content_plans')
      .delete()
      .eq('id', id);

    loadContentPlans();
  };

  const handleGenerateContentPlan = async (planData: {
    planName: string;
    startDate: string;
    endDate: string;
    frequency: string;
    posts: PlannedPostServiceType[];
  }) => {
    const { data: planRecord } = await supabase
      .from('content_plans')
      .insert({
        user_id: userId,
        brand_profile_id: brandProfile?.id || null,
        plan_name: planData.planName,
        start_date: planData.startDate,
        end_date: planData.endDate,
        frequency: planData.frequency,
        total_posts: planData.posts.length,
        status: 'active'
      })
      .select()
      .single();

    if (planRecord) {
      const plannedPostsData = planData.posts.map((post, index) => ({
        content_plan_id: planRecord.id,
        user_id: userId,
        title: post.title,
        suggested_date: post.suggestedDate.toISOString().split('T')[0],
        suggested_time: post.suggestedTime,
        rationale: post.rationale,
        platforms: post.platforms,
        status: 'suggested' as const,
        order_in_plan: index
      }));

      await supabase.from('planned_posts').insert(plannedPostsData);

      // Immediately update state so calendar reflects new planned posts
      setPlannedPosts((prev) => [...prev, ...planData.posts]);


      await loadContentPlans();
      setCurrentView('schedule');
    }
  };

  const handleGenerateSmartSchedule = async (scheduleData: {
    frequency: string;
    preferredDay: string;
    preferredTime: string;
    numberOfPosts: number;
    startDate: string;
  }) => {
    const dates = generateRecurringSchedule(
      scheduleData.startDate,
      scheduleData.frequency as 'weekly' | 'biweekly' | 'monthly',
      scheduleData.preferredDay,
      scheduleData.numberOfPosts
    );

    const scheduledPostsData = dates.map((date, index) => ({
      user_id: userId,
      brand_profile_id: brandProfile?.id || null,
      title: `Scheduled Post #${index + 1}`,
      caption: 'Content to be generated',
      hashtags: [],
      platforms: ['instagram'],
      image_url: '',
      scheduled_date: date.toISOString().split('T')[0],
      scheduled_time: scheduleData.preferredTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      status: 'draft' as const,
      notes: `Auto-generated ${scheduleData.frequency} schedule`
    }));

    await supabase.from('scheduled_posts').insert(scheduledPostsData);

    // Immediately update state so calendar reflects new posts
    setScheduledPosts((prev) => [...prev, ...scheduledPostsData]);

    await loadScheduledPosts();
    setCurrentView('schedule');
  };

  const getSelectedCaption = () => {
    if (!generatedContent) return '';
    const baseCaption = generatedContent[selectedTone];
    const cta = generatedContent.ctaVariations?.[selectedTone];
    return cta ? `${baseCaption}\n\n${cta}` : baseCaption;
  };

  const getPostTitle = (): string => {
    const maxLength = 50;
    const desc = currentDescription.trim();

    const firstSentence = desc.split(/[.!?]/)[0];
    if (firstSentence.length <= maxLength) {
      return firstSentence;
    }

    return desc.substring(0, maxLength) + '...';
  };

  const handleCreateAlarm = async (alarmData: {
    title: string;
    alarmDatetime: string;
    scheduledPostId: string | null;
    plannedPostId: string | null;
    soundEnabled: boolean;
    notificationEnabled: boolean;
    notes: string;
  }) => {
    await supabase
      .from('alarms')
      .insert({
        user_id: userId,
        title: alarmData.title,
        alarm_datetime: alarmData.alarmDatetime,
        scheduled_post_id: alarmData.scheduledPostId,
        planned_post_id: alarmData.plannedPostId,
        sound_enabled: alarmData.soundEnabled,
        notification_enabled: alarmData.notificationEnabled,
        notes: alarmData.notes,
        status: 'active',
      });

    loadAlarms();
  };

  const handleDeleteAlarm = async (id: string) => {
    await supabase.from('alarms').delete().eq('id', id);
    loadAlarms();
  };

  const handleDismissAlarm = async (id: string) => {
    await supabase
      .from('alarms')
      .update({ status: 'dismissed' })
      .eq('id', id);
    setRingingAlarm(null);
    loadAlarms();
  };


  return (
    <>
    {ringingAlarm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center animate-pulse" style={{ zIndex: 99999 }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-bounce">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#FFC107] rounded-full blur-xl opacity-50 animate-ping"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#FFD54F] to-[#FFC107] rounded-full flex items-center justify-center">
                <Bell className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">ALARM!</h2>
            <h3 className="text-2xl font-bold text-[#FFC107] mb-4">{ringingAlarm.title}</h3>

            {ringingAlarm.notes && (
              <p className="text-gray-600 mb-6">{ringingAlarm.notes}</p>
            )}

            <button
              onClick={() => handleDismissAlarm(ringingAlarm.id)}
              className="w-full px-8 py-4 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      </div>
    )}
    <div className="min-h-screen bg-[#FAFFF7] flex">
      <aside className={`bg-white/70 backdrop-blur-xl border-r border-gray-200/50 flex flex-col sidebar-glass relative overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-60'}`}>
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-[#C5E1A5] to-[#FFF9C4]"
            >
              <img src={logoIcon} alt="Content Hive" className="w-9 h-9" />
            </button>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#7CB342] to-[#42A5F5] bg-clip-text text-transparent">Content Hive</h1>
                <p className="text-xs text-gray-500 font-medium">AI Content Creator</p>
              </div>
            )}
          </div>
        </div>
        <nav className={`flex-1 p-6 space-y-4 ${sidebarCollapsed ? 'px-3' : ''}`}>
          <button
            onClick={() => setCurrentView('generator')}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'generator'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
            title={sidebarCollapsed ? 'Content Generator' : ''}
          >
            <Sparkles className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-semibold text-[#7CB342]">Content Generator</span>}
          </button>
          <button
            onClick={() => setCurrentView('schedule')}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'schedule'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
            title={sidebarCollapsed ? 'Schedule & Alarms' : ''}
          >
            <CalendarDays className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-semibold text-[#FFD54F]">Schedule & Alarms</span>}
          </button>
          <button
            onClick={() => setCurrentView('strategy')}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'strategy'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
            title={sidebarCollapsed ? 'AI Content Strategy' : ''}
          >
            <Lightbulb className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-semibold text-[#7CB342]">AI Content Strategy</span>}
          </button>
          <button
            onClick={() => setCurrentView('video')}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'video'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
            title={sidebarCollapsed ? 'Video Tips' : ''}
          >
            <Video className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-semibold text-[#FFD54F]">Video Tips</span>}
          </button>

          <div className={`border-t border-gray-200/50 ${sidebarCollapsed ? 'mx-2' : 'mx-0'} pt-4`}></div>

          <button
            onClick={() => setShowSavedContentModal(true)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 glass-button`}
            title={sidebarCollapsed ? 'Saved Content' : ''}
          >
            <FolderOpen className="w-5 h-5" />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-[#7CB342]">Saved Content</span>
                {contentHistory.length > 0 && (
                  <span className="text-xs bg-[#7CB342] text-white rounded-full px-2 py-0.5">{contentHistory.length}</span>
                )}
              </div>
            )}
          </button>

          <button
            onClick={() => setShowContentPlansModal(true)}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 glass-button`}
            title={sidebarCollapsed ? 'Content Plans' : ''}
          >
            <FileText className="w-5 h-5" />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-[#42A5F5]">Content Plans</span>
                {contentPlans.length > 0 && (
                  <span className="text-xs bg-[#42A5F5] text-white rounded-full px-2 py-0.5">{contentPlans.length}</span>
                )}
              </div>
            )}
          </button>
        </nav>
        {!sidebarCollapsed && (
          <div className="p-6 border-t border-gray-200/50">
            <div className="glass-badge text-center py-3 px-4 rounded-xl">
              <p className="text-xs font-bold bg-gradient-to-r from-[#7CB342] to-[#42A5F5] bg-clip-text text-transparent">Powered by AI</p>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">

        {currentView === 'generator' ? (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center mb-3">
                <img src={logo} alt="Content Hive" className="w-full max-w-xs" />
              </div>
            </div>
            <StepNavigator
              currentStep={currentStep}
              onStepClick={handleStepClick}
              canNavigate={{
                step1: true,
                step2: true,
                step3: true
              }}
            />
            {currentStep === 1 && (
              <>
                <ContentHistory
                  history={contentHistory}
                  onLoadContent={handleLoadContent}
                  onDeleteContent={handleDeleteContent}
                />
                <InputSection onGenerate={handleGenerate} isGenerating={isGenerating} />
              </>
            )}

            {currentStep === 2 && (
              <>
                {generatedContent ? (
                  <>
                    {visualSuggestions.length > 0 && (
                      <VisualSuggestions suggestions={visualSuggestions} />
                    )}

                    {postOutline && <PostOutline outline={postOutline} />}

                    <CaptionSelector content={generatedContent} onSelectTone={handleSelectTone} />
                    <HashtagDisplay
                      hashtags={generatedContent.hashtags}
                      onHashtagsChange={(updatedHashtags) => {
                        setGeneratedContent({
                          ...generatedContent,
                          hashtags: updatedHashtags
                        });
                      }}
                    />
                  </>
                ) : (
                  <div className="card-float text-center py-16 animate-fade-in">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#7CB342] to-[#4CAF50] rounded-[20px] flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-[#3C3C3C] text-lg">
                      Generate content first to see AI suggestions and captions
                    </p>
                  </div>
                )}
              </>
            )}

            {currentStep === 3 && (
              <>
                {generatedContent ? (
                  <>
                    <PlatformPreviews
                      caption={getSelectedCaption()}
                      hashtags={generatedContent.hashtags}
                      imageUrl={imageUrl}
                      resizedImages={resizedImages}
                    />

                    <div className="card-float p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">Save Your Content</h3>
                          <p className="text-sm text-gray-600">Save this generated content and start fresh</p>
                        </div>
                        <button
                          onClick={async () => {
                            setIsSaving(true);
                            await saveContentToHistory(currentDescription, generatedContent, imageUrl, resizedImages);
                            setIsSaving(false);
                            setCurrentStep(1);
                            setGeneratedContent(null);
                            setImageUrl(null);
                            setResizedImages(undefined);
                          }}
                          disabled={isSaving}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          {isSaving ? 'Saving...' : 'Save & Start New'}
                        </button>
                      </div>
                    </div>

                    <div className="card-float p-6 mb-8">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Ready to schedule?</h3>
                            <p className="text-sm text-gray-600">Schedule this content for future posting or view your calendar</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setCurrentView('schedule')}
                              className="btn-secondary flex items-center gap-2"
                            >
                              <CalendarDays className="w-5 h-5" />
                              View Calendar
                            </button>
                            <button
                              onClick={() => setShowScheduleModal(true)}
                              className="btn-schedule flex items-center gap-2"
                            >
                              <CalendarDays className="w-5 h-5" />
                              Schedule Post
                            </button>
                          </div>
                        </div>
                        {scheduledPosts.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 mb-2">
                              You have {scheduledPosts.length} scheduled post{scheduledPosts.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <ExportSection content={generatedContent} selectedCaption={getSelectedCaption()} />
                  </>
                ) : (
                  <div className="card-float text-center py-16 animate-fade-in">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#7CB342] to-[#4CAF50] rounded-[20px] flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-[#3C3C3C] text-lg">
                      Generate content first to see platform previews and export options
                    </p>
                  </div>
                )}
              </>
            )}

          </>
        ) : currentView === 'schedule' ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#7CB342] mb-2">Schedule & Alarms</h2>
              <p className="text-gray-600">Manage your content calendar and set reminders</p>
            </div>
            <div className="mb-6 animate-fade-in">
              <div className="card-float p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Smart Schedule Planner
                    </h3>
                    <p className="text-base text-gray-600">
                      Create recurring posting schedules automatically with AI-powered timing recommendations
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSmartPlanner(true)}
                    className="btn-primary w-full py-4 text-lg"
                  >
                    Generate Schedule
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <AlarmManager
                alarms={alarms}
                onAddAlarm={() => {
                  setLinkedPostForAlarm(undefined);
                  setShowAlarmModal(true);
                }}
                onDeleteAlarm={handleDeleteAlarm}
                onDismissAlarm={handleDismissAlarm}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Calendar
                  scheduledPosts={scheduledPosts}
                  plannedPosts={plannedPosts}
                  onDateSelect={setSelectedDate}
                  onPostClick={handleEditScheduledPost}
                  selectedDate={selectedDate}
                />
              </div>
              <div>
                <ScheduledPostsList
                  scheduledPosts={scheduledPosts}
                  plannedPosts={plannedPosts}
                  selectedDate={selectedDate}
                  onEdit={handleEditScheduledPost}
                  onDelete={handleDeletePost}
                  onSetAlarm={(post) => {
                    setLinkedPostForAlarm(post);
                    setShowAlarmModal(true);
                  }}
                />
              </div>
            </div>
          </>
        ) : currentView === 'strategy' ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#7CB342] mb-2">AI Content Strategy</h2>
              <p className="text-gray-600">Plan your content calendar with AI-powered recommendations</p>
            </div>

            <ContentStrategySection
              onOpenPlanGenerator={() => setShowPlanGenerator(true)}
              onOpenSmartPlanner={() => setShowSmartPlanner(true)}
              generatedPlans={[]}
            />
          </>
        ) : currentView === 'video' ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#7CB342] mb-2">Video Optimization Tips</h2>
              <p className="text-gray-600">Learn best practices for creating engaging video content</p>
            </div>

            <VideoOptimizationTips />
          </>
        ) : null}
        </div>
      </main>

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleSchedulePost}
        prefilledData={{
          title: getPostTitle(),
          caption: getSelectedCaption()
        }}
      />

      <ContentPlanGenerator
        isOpen={showPlanGenerator}
        onClose={() => setShowPlanGenerator(false)}
        onGeneratePlan={handleGenerateContentPlan}
        brandProfile={brandProfile}
      />

      <SmartSchedulePlanner
        isOpen={showSmartPlanner}
        onClose={() => setShowSmartPlanner(false)}
        onGenerateSchedule={handleGenerateSmartSchedule}
      />

      <AlarmModal
        isOpen={showAlarmModal}
        onClose={() => {
          setShowAlarmModal(false);
          setLinkedPostForAlarm(undefined);
        }}
        onCreateAlarm={handleCreateAlarm}
        linkedPost={linkedPostForAlarm}
      />

      <SavedContentModal
        isOpen={showSavedContentModal}
        onClose={() => setShowSavedContentModal(false)}
        savedContent={contentHistory}
        onLoadContent={handleLoadContent}
        onDeleteContent={handleDeleteContent}
      />

      <ContentPlansModal
        isOpen={showContentPlansModal}
        onClose={() => setShowContentPlansModal(false)}
        onDeletePlan={handleDeleteContentPlan}
        contentPlans={contentPlans.map(plan => {
          const planPosts = plannedPosts.filter(p => p.content_plan_id === plan.id);
          return {
            id: plan.id,
            topics: planPosts.map(p => p.title),
            schedule: planPosts.map(p => ({
              date: new Date(p.suggested_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              topic: p.title
            })),
            insights: [
              `${plan.plan_name} - ${plan.frequency}`,
              `${plan.total_posts} posts planned from ${new Date(plan.start_date).toLocaleDateString()} to ${new Date(plan.end_date).toLocaleDateString()}`,
              `Status: ${plan.status}`
            ]
          };
        })}
      />
    </div>
    </>
  );
}

export default App;
