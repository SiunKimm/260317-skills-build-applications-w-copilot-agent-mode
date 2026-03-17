import { useCallback, useEffect, useMemo, useState } from 'react';
import ResourceTablePage from './ResourceTablePage';
import { extractCollection, logFetchedCollection } from '../utils/api';

function Workouts({ apiBaseUrl }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWorkouts = useCallback(
    async (signal) => {
      setLoading(true);
      setError('');

      try {
        const endpoint = `${apiBaseUrl}/workouts/`;
        const response = await fetch(endpoint, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`운동 추천 데이터를 불러오지 못했습니다. (${response.status})`);
        }

        const payload = await response.json();
        const collection = extractCollection(payload);

        logFetchedCollection('workouts', endpoint, payload, collection);
        setWorkouts(collection);
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

    loadWorkouts(controller.signal);

    return () => controller.abort();
  }, [loadWorkouts]);

  const difficultyCounts = workouts.reduce((counts, workout) => {
    const nextCounts = { ...counts };
    nextCounts[workout.difficulty] = (nextCounts[workout.difficulty] ?? 0) + 1;
    return nextCounts;
  }, {});

  const columns = useMemo(
    () => [
      { key: 'title', label: '운동명', value: (workout) => workout.title },
      { key: 'focus_area', label: '집중 부위', value: (workout) => workout.focus_area },
      { key: 'difficulty', label: '난이도', value: (workout) => workout.difficulty },
      { key: 'coach_name', label: '코치', value: (workout) => workout.coach_name },
      { key: 'duration_minutes', label: '시간', value: (workout) => `${workout.duration_minutes}분` },
      { key: 'recommended_for', label: '추천 대상', value: (workout) => workout.recommended_for },
    ],
    []
  );

  const stats = [
    { label: '추천 수', value: workouts.length },
    { label: '난이도 단계', value: Object.keys(difficultyCounts).length },
    {
      label: '가장 많은 난이도',
      value:
        Object.entries(difficultyCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ??
        '데이터 없음',
    },
  ];

  return (
    <ResourceTablePage
      eyebrow="Workouts"
      title="운동 추천"
      description="난이도와 코치 기준으로 추천 운동 프로그램을 탐색할 수 있습니다."
      endpoint={`${apiBaseUrl}/workouts/`}
      rows={workouts}
      columns={columns}
      stats={stats}
      loading={loading}
      error={error}
      onRefresh={() => loadWorkouts()}
      emptyMessage="표시할 운동 추천 데이터가 없습니다."
      searchPlaceholder="운동명, 코치, 집중 부위 또는 난이도로 검색"
      detailTitle={(workout) => `${workout.title} 상세 정보`}
    />
  );
}

export default Workouts;