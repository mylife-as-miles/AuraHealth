import React, { useState, useMemo } from 'react';
import {
  Bell,
  Activity,
  ClipboardCheck,
  RefreshCw,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  MoreHorizontal,
  ChevronDown,
  X,
  Check,
  Inbox,
  ClipboardList
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { NotificationItem } from '../lib/types';
import EmptyState from './EmptyState';

// --- Mock Data Removed ---

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'tasks'>('all');
  const notifications = useLiveQuery(() => db.notifications.orderBy('timestamp').reverse().toArray()) || [];
  const [loadingMore, setLoadingMore] = useState(false);

  // --- Derived State ---
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !n.read;
      if (filter === 'critical') return n.type === 'critical';
      if (filter === 'tasks') return n.type === 'task';
      return true;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // --- Handlers ---
  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.notifications.delete(id);
  };

  const handleMarkAsRead = (id: string) => {
    db.notifications.update(id, { read: true });
  };

  const handleMarkAllRead = () => {
    db.notifications.toCollection().modify({ read: true });
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const more: NotificationItem[] = [
        {
          id: `n-old-${Date.now()}`,
          type: 'system',
          title: 'Weekly Analytics Report Available',
          content: 'Your department performance metrics for last week are now ready for review.',
          time: '3 days ago',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
          read: true,
          dismissible: true
        },
        {
          id: `n-old-2-${Date.now()}`,
          type: 'task',
          title: 'Patient Transfer Request',
          content: 'Pending approval for transfer of Patient #229 to Oncology Ward.',
          time: '4 days ago',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
          read: true,
          action: { label: 'Review Request', secondary: true },
          dismissible: true
        }
      ];
      db.notifications.bulkAdd(more);
      setLoadingMore(false);
    }, 1200);
  };

  // --- Render Helpers ---
  const getTypeStyles = (type: NotificationItem['type']) => {
    switch (type) {
      case 'critical': return { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', icon: Activity };
      case 'task': return { bg: 'bg-cyan/10', text: 'text-cyan-600 dark:text-cyan', border: 'border-cyan/20', icon: ClipboardCheck };
      case 'system': return { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/20', icon: RefreshCw };
      case 'consult': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30', icon: FileText };
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="bg-white/60 dark:bg-card-dark/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-soft border border-white/20 dark:border-white/5 flex flex-col min-h-[600px]">

        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 mr-2">Filter by:</span>

            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'critical', label: 'Critical', dot: 'bg-accent' },
              { id: 'tasks', label: 'Tasks', dot: 'bg-cyan' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${filter === f.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20 hover:scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                {f.dot && <span className={`w-2 h-2 rounded-full ${f.dot}`}></span>}
                {f.label}
                {f.count !== undefined && f.count > 0 && (
                  <span className="bg-accent/20 text-accent px-1.5 py-0.5 rounded-full text-[10px] leading-none ml-1">{f.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-gray-400 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <CheckCircle size={14} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => {
              const style = getTypeStyles(n.type);
              const Icon = style.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                  className={`bg-white dark:bg-card-dark rounded-2xl p-5 border shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${!n.read ? 'border-l-4 border-l-primary' : 'border border-transparent dark:border-white/5 opacity-80 hover:opacity-100'
                    } ${n.type === 'critical' ? 'border-red-100 dark:border-red-900/30' : ''}`}
                >
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center flex-shrink-0 ${style.text}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 w-full relative">
                      <div className="flex items-center justify-between mb-1 pr-8">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-bold text-base ${!n.read ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            {n.title}
                          </h5>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className={`text-sm mb-3 leading-relaxed ${!n.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                        {n.content}
                      </p>

                      <div className="flex items-center gap-3">
                        {n.action && (
                          <button className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${n.action.secondary
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            : n.type === 'critical' ? 'bg-accent text-white hover:opacity-90 shadow-md' : 'bg-primary text-white hover:opacity-90 shadow-md'
                            }`}>
                            {n.action.label}
                          </button>
                        )}
                        {n.dismissible && (
                          <button
                            onClick={(e) => handleDismiss(n.id, e)}
                            className="text-gray-400 hover:text-red-500 text-xs font-bold px-2 py-1 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                          >
                            <X size={14} /> Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Inbox size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300">All caught up!</h3>
              <p className="text-sm text-gray-400 mt-1">No notifications match your current filter.</p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 text-primary dark:text-white text-sm font-bold hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Load More */}
        {notifications.length > 0 && (
          <div className="mt-12 text-center pb-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="text-sm text-gray-500 hover:text-primary dark:hover:text-white font-bold transition-colors flex items-center justify-center gap-2 mx-auto px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              {loadingMore ? (
                <><div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div> Loading...</>
              ) : (
                <>Load earlier notifications <ChevronDown size={16} /></>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}