import { useCallback, useEffect, useMemo, useState } from 'react';
import ResourceTablePage from './ResourceTablePage';
import { extractCollection, logFetchedCollection } from '../utils/api';

function Users({ apiBaseUrl }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(
    async (signal) => {
      setLoading(true);
      setError('');

      try {
        const endpoint = `${apiBaseUrl}/users/`;
        const response = await fetch(endpoint, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`사용자 데이터를 불러오지 못했습니다. (${response.status})`);
        }

        const payload = await response.json();
        const collection = extractCollection(payload);

        logFetchedCollection('users', endpoint, payload, collection);
        setUsers(collection);
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

    loadUsers(controller.signal);

    return () => controller.abort();
  }, [loadUsers]);

  const totalPoints = users.reduce(
    (sum, user) => sum + (user.total_points ?? 0),
    0
  );
  const topUser = users.reduce((bestUser, currentUser) => {
    if (!bestUser) {
      return currentUser;
    }

    return currentUser.total_points > bestUser.total_points ? currentUser : bestUser;
  }, null);

  const columns = useMemo(
    () => [
      { key: 'full_name', label: '이름', value: (user) => user.full_name },
      { key: 'hero_alias', label: '히어로 명', value: (user) => user.hero_alias },
      { key: 'email', label: '이메일', value: (user) => user.email },
      { key: 'team_name', label: '팀', value: (user) => user.team_name },
      { key: 'universe', label: '유니버스', value: (user) => user.universe },
      { key: 'weekly_goal', label: '주간 목표', value: (user) => `${user.weekly_goal}분` },
      { key: 'total_points', label: '포인트', value: (user) => user.total_points },
    ],
    []
  );

  const stats = [
    { label: '등록 사용자', value: users.length },
    { label: '총 포인트', value: totalPoints.toLocaleString() },
    { label: '상위 사용자', value: topUser ? topUser.hero_alias : '데이터 없음' },
  ];

  return (
    <ResourceTablePage
      eyebrow="Users"
      title="사용자 현황"
      description="운동 목표와 누적 포인트를 기준으로 팀원 활동을 추적합니다."
      endpoint={`${apiBaseUrl}/users/`}
      rows={users}
      columns={columns}
      stats={stats}
      loading={loading}
      error={error}
      onRefresh={() => loadUsers()}
      emptyMessage="표시할 사용자 데이터가 없습니다."
      searchPlaceholder="이름, 히어로 명, 이메일 또는 팀으로 검색"
      detailTitle={(user) => `${user.hero_alias} 상세 정보`}
    />
  );
}

export default Users;