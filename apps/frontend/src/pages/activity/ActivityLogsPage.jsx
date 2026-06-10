import React, { useEffect, useState, useCallback } from 'react';
import activityService from '../../services/activityService';
import NotificationSummaryCards from '../../components/activity/NotificationSummaryCards';
import TimelineFilters from '../../components/activity/TimelineFilters';
import ActivityTimeline from '../../components/activity/ActivityTimeline';
import AuditLogFilters from '../../components/activity/AuditLogFilters';
import AuditLogTable from '../../components/activity/AuditLogTable';
import Card from '../../components/common/Card';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ActivityLogsPage() {
  const [timeline, setTimeline] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [timelineFilter, setTimelineFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadData = useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) setRefreshing(true);
      try {
        const [timelineData, notificationData, auditData] = await Promise.all([
          activityService.getTimeline(timelineFilter),
          activityService.getNotifications(),
          activityService.getAuditLogs({
            search,
            module: moduleFilter,
            startDate,
            endDate,
          }),
        ]);
        setTimeline(timelineData || []);
        setNotifications(notificationData || []);
        setAuditLogs(auditData || []);
      } catch (err) {
        console.error('Failed to load activity details', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [timelineFilter, search, moduleFilter, startDate, endDate]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  if (loading && timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
        <span className="text-xs font-semibold">Loading Activity Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left pb-16 relative">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-[#111827] tracking-tight">
            Activity Logs & Notifications
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Procurement activity timeline and audit records.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Refresh Button */}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2.5 border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-55 rounded-xl cursor-pointer shadow-xs transition-all flex items-center justify-center"
            title="Refresh logs"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Section 1: Notifications summary cards */}
      <NotificationSummaryCards timeline={timeline} notifications={notifications} />

      {/* Two-Column split: Left Timeline, Right Audit logs or side panel if open */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 1-Column: Timeline */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
            Activity Timeline
          </h3>
          <TimelineFilters active={timelineFilter} onChange={setTimelineFilter} />
          <ActivityTimeline timeline={timeline} />
        </Card>

        {/* Right 2-Columns: Audit Logs Table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-100 pb-2">
              Audit Logs
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Immutable procurement logs and chronological history record chain. Access or deletion
              operations are restricted.
            </p>
            <AuditLogFilters
              search={search}
              setSearch={setSearch}
              moduleFilter={moduleFilter}
              setModuleFilter={setModuleFilter}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </Card>

          <AuditLogTable logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}
