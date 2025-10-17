
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/dashboard/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import useProgress from '../../../hooks/useProgress';
import { LoadingSpinner, ErrorMessage } from '../../../components/ui';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#f97316'];

const ProgressPage = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [chartType, setChartType] = useState('bar');
  
  // Use custom hook for progress data
  const { 
    weeklyData, 
    monthlyData, 
    habitDistribution, 
    streaks, 
    achievements,
    loading,
    error, 
    clearError,
    loadAllProgressData
  } = useProgress();
  
  // Load data on mount and when timeRange changes
  useEffect(() => {
    loadAllProgressData(timeRange);
  }, [timeRange, loadAllProgressData]);
  
  // Data based on selected time range
  const data = timeRange === 'weekly' ? weeklyData : monthlyData;
  
  // Display error message if loading failed
  if (error && !loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center">
          <ErrorMessage 
            error={error} 
            onRetry={() => {
              clearError();
              loadAllProgressData(timeRange);
            }} 
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Tracking</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <div className="inline-flex rounded-md shadow-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTimeRange('weekly')}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-l-lg ${
                  timeRange === 'weekly'
                    ? 'bg-accent text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('monthly')}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-r-lg ${
                  timeRange === 'monthly'
                    ? 'bg-accent text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Monthly
              </button>
            </div>
            
            <div className="inline-flex rounded-md shadow-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-l-lg ${
                  chartType === 'bar'
                    ? 'bg-accent text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Bar
              </button>
              <button
                type="button"
                onClick={() => setChartType('line')}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-medium rounded-r-lg ${
                  chartType === 'line'
                    ? 'bg-accent text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Line
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Chart Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {timeRange === 'weekly' ? 'Weekly' : 'Monthly'} Habit Completion
            </h2>
            
            <div className="h-60 sm:h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="lg" />
                  <span className="ml-3 text-gray-500 dark:text-gray-400">
                    Loading {timeRange} data...
                  </span>
                </div>
              ) : data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151',
                          color: '#f3f4f6'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: '#9ca3af' }} />
                      <Bar dataKey="completed" name="Completed" fill="#8b5cf6" />
                      <Bar dataKey="target" name="Target" fill="#3b82f6" />
                    </BarChart>
                  ) : (
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151',
                          color: '#f3f4f6'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: '#9ca3af' }} />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        name="Completed" 
                        stroke="#8b5cf6" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="target" 
                        name="Target" 
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No habit data available</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Create and complete habits to see your progress</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Habit Performance Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Habit Completion Rate
            </h2>
            
            <div className="h-60 sm:h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner size="lg" />
                  <span className="ml-3 text-gray-500 dark:text-gray-400">
                    Loading habit distribution...
                  </span>
                </div>
              ) : habitDistribution && habitDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={habitDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={window.innerWidth < 640 ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => window.innerWidth < 640 ? 
                        `${value}%` : 
                        `${name} ${value}%`}
                    >
                      {habitDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        borderColor: '#374151',
                        color: '#f3f4f6'
                      }} 
                    />
                    <Legend wrapperStyle={{ color: '#9ca3af' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">No habit distribution data</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Complete habits to see your progress</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Streak Analysis Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Current Streaks</h2>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-500 dark:text-gray-400">
                  Loading streak data...
                </span>
              </div>
            ) : streaks && streaks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {streaks.map((streak, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{streak.habit}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Longest: {streak.longest} days</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-1">
                          <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.364 5.864a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0v-3.75a.75.75 0 01.75-.75zm-3.75 3.75a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm8.25-.75a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base sm:text-lg font-bold">{streak.current}</span>
                      </div>
                      <span className="ml-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">days</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">No active streaks</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Complete habits consecutively to build streaks</p>
              </div>
            )}
          </div>
          
          {/* Achievements Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Achievements</h2>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-500 dark:text-gray-400">
                  Loading achievements...
                </span>
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {achievements.map((achievement, index) => {
                  // Map the icon type to the actual SVG
                  let iconElement = null;
                  
                  switch(achievement.icon) {
                    case 'flame':
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${achievement.achieved ? 'text-amber-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                      );
                      break;
                    case 'badge':
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${achievement.achieved ? 'text-yellow-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      );
                      break;
                    case 'star':
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${achievement.achieved ? 'text-blue-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                      break;
                    case 'academic-cap':
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${achievement.achieved ? 'text-purple-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      );
                      break;
                    case 'sun':
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${achievement.achieved ? 'text-orange-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      );
                      break;
                    case 'moon':
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${achievement.achieved ? 'text-indigo-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                      );
                      break;
                    default:
                      iconElement = (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      );
                  }
                  
                  return (
                    <div 
                      key={index}
                      className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg text-center ${
                        achievement.achieved 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'bg-gray-50 dark:bg-gray-700/50 opacity-60'
                      }`}
                    >
                      <div className="mb-1">{iconElement}</div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">No achievements yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Keep building your habits to earn achievements</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;