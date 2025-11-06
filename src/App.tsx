import { useState, useEffect } from 'react';
import { Sparkles, CalendarDays, Video, Lightbulb } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { CaptionSelector } from './components/CaptionSelector';
import { HashtagDisplay } from './components/HashtagDisplay';
import { PlatformPreviews } from './components/PlatformPreviews';
import { ExportSection } from './components/ExportSection';
import { BrandProfileModal } from './components/BrandProfileModal';
import { ContentHistory } from './components/ContentHistory';
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
  const [showSmartPlanner, setShowSmartPlanner] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [plannedPosts, setPlannedPosts] = useState<PlannedPost[]>([]);
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [linkedPostForAlarm, setLinkedPostForAlarm] = useState<ScheduledPost | PlannedPost | undefined>();

  useEffect(() => {
    loadBrandProfile();
    loadContentHistory();
    loadScheduledPosts();
    loadContentPlans();
    loadAlarms();
  }, []);

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

      await saveContentToHistory(fullDescription, content, uploadedImageUrl, resized as ResizedImages | undefined);
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
    setShowScheduleView(true);
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
      setShowScheduleView(true);
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
    setShowScheduleView(true);
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
    loadAlarms();
  };


  return (
    <div className="min-h-screen bg-[#FAFFF7] flex">
      <aside className="w-60 bg-white/70 backdrop-blur-xl border-r border-gray-200/50 flex flex-col sidebar-glass relative overflow-hidden">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7CB342] via-[#4CAF50] to-[#42A5F5] rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#7CB342] to-[#42A5F5] bg-clip-text text-transparent">Content Hive</h1>
              <p className="text-xs text-gray-500 font-medium">AI Content Creator</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-4">
          <button
            onClick={() => setCurrentView('generator')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'generator'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-[#7CB342]">Content Generator</span>
          </button>
          <button
            onClick={() => setCurrentView('schedule')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'schedule'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="font-semibold text-[#FFD54F]">Schedule & Alarms</span>
          </button>
          <button
            onClick={() => setCurrentView('strategy')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'strategy'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
          >
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold text-[#7CB342]">AI Content Strategy</span>
          </button>
          <button
            onClick={() => setCurrentView('video')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              currentView === 'video'
                ? 'glass-button-active shadow-lg'
                : 'glass-button'
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="font-semibold text-[#FFD54F]">Video Tips</span>
          </button>
        </nav>
        <div className="p-6 border-t border-gray-200/50 relative">
          <div className="glass-badge text-center py-3 px-4 rounded-xl">
            <p className="text-xs font-bold bg-gradient-to-r from-[#7CB342] to-[#42A5F5] bg-clip-text text-transparent">Powered by AI</p>
          </div>
          <svg className="bee-trail-decoration" width="240" height="600" viewBox="0 0 240 600" xmlns="http://www.w3.org/2000/svg">
            <g className="bee-trail-path">
              <circle cx="30" cy="560" r="3" fill="#FFD54F" opacity="0.3" className="trail-dot" />
              <circle cx="50" cy="540" r="3" fill="#FFD54F" opacity="0.35" className="trail-dot" />
              <circle cx="40" cy="520" r="3" fill="#FFD54F" opacity="0.4" className="trail-dot" />
              <circle cx="60" cy="500" r="3" fill="#FFD54F" opacity="0.45" className="trail-dot" />
              <circle cx="50" cy="480" r="3" fill="#FFD54F" opacity="0.5" className="trail-dot" />
              <circle cx="70" cy="460" r="3" fill="#FFD54F" opacity="0.55" className="trail-dot" />
              <circle cx="60" cy="440" r="3" fill="#FFD54F" opacity="0.6" className="trail-dot" />
              <circle cx="80" cy="420" r="3" fill="#FFD54F" opacity="0.65" className="trail-dot" />
              <circle cx="70" cy="400" r="3" fill="#FFD54F" opacity="0.7" className="trail-dot" />
              <circle cx="90" cy="380" r="3" fill="#FFD54F" opacity="0.75" className="trail-dot" />
              <circle cx="80" cy="360" r="3" fill="#FFD54F" opacity="0.8" className="trail-dot" />
              <circle cx="100" cy="340" r="3" fill="#FFD54F" opacity="0.85" className="trail-dot" />
              <circle cx="90" cy="320" r="3" fill="#FFD54F" opacity="0.9" className="trail-dot" />
              <circle cx="110" cy="300" r="3" fill="#FFD54F" opacity="0.95" className="trail-dot" />
              <circle cx="100" cy="280" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="120" cy="260" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="110" cy="240" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="130" cy="220" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="120" cy="200" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="140" cy="180" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="130" cy="160" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="150" cy="140" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="140" cy="120" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="160" cy="100" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
              <circle cx="150" cy="80" r="3" fill="#FFD54F" opacity="1" className="trail-dot" />
            </g>
            <g transform="translate(30, 570)" className="bee-body">
              <g className="bee-wing-left">
                <ellipse cx="-12" cy="-8" rx="10" ry="6" fill="#fff" opacity="0.6" stroke="#FFD54F" strokeWidth="1" />
              </g>
              <g className="bee-wing-right">
                <ellipse cx="12" cy="-8" rx="10" ry="6" fill="#fff" opacity="0.6" stroke="#FFD54F" strokeWidth="1" />
              </g>
              <ellipse cx="0" cy="0" rx="10" ry="14" fill="#FFD54F" />
              <ellipse cx="0" cy="-6" rx="9" ry="4" fill="#000" opacity="0.8" />
              <ellipse cx="0" cy="2" rx="9" ry="4" fill="#000" opacity="0.8" />
              <ellipse cx="0" cy="10" rx="8" ry="3.5" fill="#000" opacity="0.8" />
              <circle cx="-4" cy="-12" r="2" fill="#000" />
              <circle cx="4" cy="-12" r="2" fill="#000" />
              <circle cx="-4" cy="-12" r="0.8" fill="#fff" />
              <circle cx="4" cy="-12" r="0.8" fill="#fff" />
              <path d="M -3 -18 Q -3 -22, -1 -22" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 3 -18 Q 3 -22, 1 -22" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">

        {currentView === 'generator' ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7CB342] to-[#4CAF50] rounded-2xl mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-[#7CB342] mb-2">Content Hive</h2>
              <p className="text-gray-600">Create buzz-worthy content with AI</p>
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

                    <div className="card-float p-6 mb-8">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Ready to schedule?</h3>
                            <p className="text-sm text-gray-600">Schedule this content for future posting or view your calendar</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowScheduleView(true)}
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
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="card-float p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      Smart Schedule Planner
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create recurring posting schedules automatically
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSmartPlanner(true)}
                    className="btn-primary mt-auto"
                  >
                    Generate Schedule
                  </button>
                </div>
              </div>

              <div className="card-float p-6">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      AI Content Planning
                    </h3>
                    <p className="text-sm text-gray-600">
                      Let AI optimize posting schedule based on your brand
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPlanGenerator(true)}
                    className="btn-primary mt-auto"
                  >
                    Create Content Plan
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
    </div>
  );
}

export default App;
