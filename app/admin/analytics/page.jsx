'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const supabase = createSupabaseClient();
  const [analytics, setAnalytics] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [timeRange, setTimeRange] = useState(30); // days
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const startDate = subDays(new Date(), timeRange);

      // Get analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('visitor_tracking')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .eq('is_bot', false);

      if (analyticsError) throw analyticsError;

      // Get personas
      const { data: personasData, error: personasError } = await supabase
        .from('visitor_personas')
        .select('*')
        .order('confidence_score', { ascending: false })
        .limit(50);

      if (personasError) throw personasError;

      // Calculate analytics
      const processed = processAnalytics(analyticsData || []);
      setAnalytics(processed);
      setPersonas(personasData || []);
    } catch (error) {
      console.error('Analytics load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalytics = (data) => {
    if (!data || data.length === 0) {
      return {
        total_visitors: 0,
        total_sessions: 0,
        total_pageviews: data.length,
        avg_session_duration: 0,
        bounce_rate: 0,
        top_pages: [],
        by_device: [],
        by_browser: [],
        by_country: [],
        daily_traffic: []
      };
    }

    const uniqueVisitors = new Set(data.map(d => d.visitor_id)).size;
    const uniqueSessions = new Set(data.map(d => d.session_id)).size;
    const avgDuration = Math.round(
      data.reduce((sum, d) => sum + (d.visit_duration_seconds || 0), 0) / data.length
    );

    // Pages
    const pageMap = {};
    data.forEach(d => {
      if (d.page_url) {
        pageMap[d.page_url] = (pageMap[d.page_url] || 0) + 1;
      }
    });
    const topPages = Object.entries(pageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({
        page: new URL(page).pathname,
        count
      }));

    // Device types
    const deviceMap = {};
    data.forEach(d => {
      const device = d.device_type || 'unknown';
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    const byDevice = Object.entries(deviceMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Browsers
    const browserMap = {};
    data.forEach(d => {
      const browser = d.browser || 'unknown';
      browserMap[browser] = (browserMap[browser] || 0) + 1;
    });
    const byBrowser = Object.entries(browserMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value
      }));

    // Daily traffic
    const dailyMap = {};
    data.forEach(d => {
      const day = format(new Date(d.timestamp), 'MMM dd');
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyTraffic = Object.entries(dailyMap)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, count]) => ({
        date,
        visitors: count
      }));

    const bounce = data.filter(d => (d.visit_duration_seconds || 0) < 5).length;
    const bounceRate = Math.round((bounce / data.length) * 100);

    return {
      total_visitors: uniqueVisitors,
      total_sessions: uniqueSessions,
      total_pageviews: data.length,
      avg_session_duration: avgDuration,
      bounce_rate: bounceRate,
      top_pages: topPages,
      by_device: byDevice,
      by_browser: byBrowser,
      daily_traffic: dailyTraffic
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Website Analytics</h1>
          <div className="flex gap-4">
            {[7, 30, 90].map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Last {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.total_visitors || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Unique visitors</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.total_sessions || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Total sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pageviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.total_pageviews || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Page visits</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.avg_session_duration || 0}s</div>
              <p className="text-xs text-gray-500 mt-1">Seconds per session</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.bounce_rate || 0}%</div>
              <p className="text-xs text-gray-500 mt-1">Users who left quickly</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Traffic */}
          {analytics?.daily_traffic && analytics.daily_traffic.length > 0 && (
            <Card className="bg-gray-900 border-gray-800 col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.daily_traffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #333' }} />
                    <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Device Distribution */}
          {analytics?.by_device && analytics.by_device.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Traffic by Device</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.by_device}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.by_device.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Pages */}
          {analytics?.top_pages && analytics.top_pages.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.top_pages}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="page" stroke="#999" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#999" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #333' }} />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Visitor Personas */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Visitor Personas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personas.length === 0 ? (
                <p className="text-gray-400">No personas detected yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400">Visitor ID</th>
                        <th className="text-left py-3 px-4 text-gray-400">Persona</th>
                        <th className="text-left py-3 px-4 text-gray-400">Confidence</th>
                        <th className="text-left py-3 px-4 text-gray-400">Visits</th>
                        <th className="text-left py-3 px-4 text-gray-400">Duration</th>
                        <th className="text-left py-3 px-4 text-gray-400">Last Visit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.slice(0, 20).map(persona => (
                        <tr key={persona.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 font-mono text-xs text-gray-400">
                            {persona.visitor_id.substring(0, 12)}...
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs font-medium">
                              {persona.persona_label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-16 bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${persona.confidence_score}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{persona.confidence_score}%</span>
                          </td>
                          <td className="py-3 px-4">{persona.visit_count}</td>
                          <td className="py-3 px-4">
                            {Math.round((persona.total_session_duration_seconds || 0) / 60)}m
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-500">
                            {persona.last_visit
                              ? format(new Date(persona.last_visit), 'MMM dd, HH:mm')
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser Distribution */}
        {analytics?.by_browser && analytics.by_browser.length > 0 && (
          <Card className="bg-gray-900 border-gray-800 mt-8">
            <CardHeader>
              <CardTitle>Browser Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.by_browser}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #333' }} />
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
