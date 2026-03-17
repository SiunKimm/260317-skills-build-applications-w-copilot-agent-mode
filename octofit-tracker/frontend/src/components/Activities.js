import { useCallback, useEffect, useMemo, useState } from 'react';
import ResourceTablePage from './ResourceTablePage';
import { extractCollection, logFetchedCollection } from '../utils/api';

function formatDateTime(value) {
  if (!value) {
    return '시간 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function Activities({ apiBaseUrl }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivities = useCallback(
    async (signal) => {
      setLoading(true);
      setError('');

      try {
        const endpoint = `${apiBaseUrl}/activities/`;
        const response = await fetch(endpoint, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`활동 데이터를 불러오지 못했습니다. (${response.status})`);
        }

        const payload = await response.json();
        const collection = extractCollection(payload);

        logFetchedCollection('activities', endpoint, payload, collection);
        setActivities(collection);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  useEffect(() => {
    const controller = new AbortController();

    loadActivities(controller.signal);

    return () => controller.abort();
  }, [loadActivities]);

  const totalMinutes = activities.reduce(
    (sum, activity) => sum + (activity.duration_minutes ?? 0),
    0
  );
  const totalCalories = activities.reduce(
    (sum, activity) => sum + (activity.calories_burned ?? 0),
    0
  );

  const columns = useMemo(
    () => [
      { key: 'user_alias', label: '사용자', value: (activity) => activity.user_alias },
      { key: 'user_email', label: '이메일', value: (activity) => activity.user_email },
      { key: 'activity_type', label: '활동', value: (activity) => activity.activity_type },
      { key: 'team_name', label: '팀', value: (activity) => activity.team_name },
      { key: 'duration_minutes', label: '시간', value: (activity) => `${activity.duration_minutes}분` },
      { key: 'calories_burned', label: '칼로리', value: (activity) => `${activity.calories_burned} kcal` },
      { key: 'performed_at', label: '수행 시각', value: (activity) => formatDateTime(activity.performed_at) },
    ],
    []
  );

  const stats = [
    { label: '활동 수', value: activities.length },
    { label: '총 운동 시간', value: `${totalMinutes.toLocaleString()}분` },
    { label: '총 칼로리', value: `${totalCalories.toLocaleString()} kcal` },
  ];

  return (
    <ResourceTablePage
      eyebrow="Activities"
      title="활동 기록"
      description="최근 수행한 운동 로그와 에너지 소모를 실시간으로 확인합니다."
      endpoint={`${apiBaseUrl}/activities/`}
      rows={activities}
      columns={columns}
      stats={stats}
      loading={loading}
      error={error}
      onRefresh={() => loadActivities()}
      emptyMessage="표시할 활동 데이터가 없습니다."
      searchPlaceholder="사용자, 이메일, 활동명 또는 팀으로 검색"
      detailTitle={(activity) => `${activity.user_alias} 활동 상세`}
    />
  );
}

export default Activities;