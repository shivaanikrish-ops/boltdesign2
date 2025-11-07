import { useState, useEffect, useRef } from 'react';
import { Bell, Plus, Trash2, Clock, Volume2, VolumeX, CheckCircle, XCircle } from 'lucide-react';
import type { Alarm } from '../types';

interface AlarmManagerProps {
  alarms: Alarm[];
  onAddAlarm: () => void;
  onDeleteAlarm: (id: string) => void;
  onDismissAlarm: (id: string) => void;
}

export function AlarmManager({ alarms, onAddAlarm, onDeleteAlarm, onDismissAlarm }: AlarmManagerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [triggeredAlarms, setTriggeredAlarms] = useState<Set<string>>(new Set());
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const notificationPermission = useRef<NotificationPermission>('default');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      notificationPermission.current = Notification.permission;
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          notificationPermission.current = permission;
        });
      }
    }

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playAlarmSound = async () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const beepDuration = 0.2;
    const pauseDuration = 0.1;
    const totalDuration = 5;
    const cycleTime = beepDuration + pauseDuration;
    const repeats = Math.floor(totalDuration / cycleTime);

    for (let i = 0; i < repeats; i++) {
      const startTime = audioContext.currentTime + (i * cycleTime);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, startTime + beepDuration);

      oscillator.start(startTime);
      oscillator.stop(startTime + beepDuration);
    }
  };

  useEffect(() => {
    alarms.forEach((alarm) => {
      if (alarm.status === 'active' && !triggeredAlarms.has(alarm.id)) {
        const alarmTime = new Date(alarm.alarm_datetime);
        const timeDiff = alarmTime.getTime() - currentTime.getTime();

        if (timeDiff <= 0 && timeDiff > -5000) {
          setTriggeredAlarms((prev) => new Set(prev).add(alarm.id));
          triggerAlarm(alarm);
        }
      }
    });
  }, [currentTime, alarms, triggeredAlarms]);

  const triggerAlarm = (alarm: Alarm) => {
    setRingingAlarm(alarm);

    if (alarm.sound_enabled) {
      playAlarmSound();
    }

    if (alarm.notification_enabled) {
      if (notificationPermission.current === 'granted') {
        const notification = new Notification('Alarm: ' + alarm.title, {
          body: alarm.notes || 'Your scheduled alarm is going off!',
          icon: '/favicon.ico',
          tag: alarm.id,
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
          setRingingAlarm(null);
          onDismissAlarm(alarm.id);
        };
      }
    }

    setTimeout(() => {
      setRingingAlarm(null);
    }, 5000);
  };

  const handleDismissRinging = (id: string) => {
    setRingingAlarm(null);
    onDismissAlarm(id);
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntil = (dateTimeStr: string) => {
    const alarmTime = new Date(dateTimeStr);
    const diff = alarmTime.getTime() - currentTime.getTime();

    if (diff < 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const activeAlarms = alarms.filter((a) => a.status === 'active').sort((a, b) =>
    new Date(a.alarm_datetime).getTime() - new Date(b.alarm_datetime).getTime()
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-[#FFC107]" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Alarms</h2>
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full ml-2">
              {activeAlarms.length}
            </span>
          </div>
        </div>
        <button
          onClick={onAddAlarm}
          className="px-4 py-2 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Alarm
        </button>
      </div>

      {activeAlarms.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-16 h-16 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No active alarms</h3>
          <p className="text-gray-500 text-sm">
            Add an alarm to get reminded about your posts
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAlarms.map((alarm) => {
            const isPast = new Date(alarm.alarm_datetime).getTime() < currentTime.getTime();
            return (
              <div
                key={alarm.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  isPast
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg truncate">
                        {alarm.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        {alarm.sound_enabled ? (
                          <Volume2 className="w-4 h-4 text-orange-600" title="Sound enabled" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-gray-400" title="Sound disabled" />
                        )}
                        {alarm.notification_enabled && (
                          <Bell className="w-4 h-4 text-orange-600" title="Notifications enabled" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(alarm.alarm_datetime)}</span>
                      </div>
                    </div>

                    <div className={`text-sm font-semibold ${isPast ? 'text-red-600' : 'text-orange-600'}`}>
                      {isPast ? 'ALARM TRIGGERED' : `Rings in: ${getTimeUntil(alarm.alarm_datetime)}`}
                    </div>

                    {alarm.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">{alarm.notes}</p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {isPast && (
                      <button
                        onClick={() => onDismissAlarm(alarm.id)}
                        className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        title="Dismiss alarm"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteAlarm(alarm.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete alarm"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {ringingAlarm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-pulse">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-bounce">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#FFC107] rounded-full blur-xl opacity-50 animate-ping"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#FFD54F] to-[#FFC107] rounded-full flex items-center justify-center animate-wiggle">
                  <Bell className="w-12 h-12 text-white animate-shake" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2">ALARM!</h2>
              <h3 className="text-2xl font-bold text-[#FFC107] mb-4">{ringingAlarm.title}</h3>

              {ringingAlarm.notes && (
                <p className="text-gray-600 mb-6">{ringingAlarm.notes}</p>
              )}

              <button
                onClick={() => handleDismissRinging(ringingAlarm.id)}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Dismiss Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
