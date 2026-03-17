import { useCallback, useEffect, useMemo, useState } from 'react';
import ResourceTablePage from './ResourceTablePage';
import { extractCollection, logFetchedCollection } from '../utils/api';

function resolveTeamsEndpoint(apiBaseUrl) {
  if (apiBaseUrl) {
    return `${apiBaseUrl}/teams/`;
  }

  if (process.env.REACT_APP_CODESPACE_NAME) {
    return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
  }

  return 'http://localhost:8000/api/teams/';
}

function Teams({ apiBaseUrl }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTeams = useCallback(
    async (signal) => {
      setLoading(true);
      setError('');

      try {
        const endpoint = resolveTeamsEndpoint(apiBaseUrl);
        const response = await fetch(endpoint, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`팀 데이터를 불러오지 못했습니다. (${response.status})`);
        }

        const payload = await response.json();
        const collection = extractCollection(payload);

        logFetchedCollection('teams', endpoint, payload, collection);
        setTeams(collection);
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

    loadTeams(controller.signal);

    return () => controller.abort();
  }, [loadTeams]);

  const topTeam = teams.reduce((bestTeam, currentTeam) => {
    if (!bestTeam) {
      return currentTeam;
    }

    return currentTeam.total_points > bestTeam.total_points ? currentTeam : bestTeam;
  }, null);

  const columns = useMemo(
    () => [
      { key: 'name', label: '팀명', value: (team) => team.name },
      { key: 'universe', label: '유니버스', value: (team) => team.universe },
      { key: 'captain', label: '주장', value: (team) => team.captain },
      { key: 'motto', label: '모토', value: (team) => team.motto },
      { key: 'member_count', label: '인원 수', value: (team) => `${team.member_count}명` },
      { key: 'total_points', label: '포인트', value: (team) => team.total_points },
    ],
    []
  );

  const stats = [
    { label: '팀 수', value: teams.length },
    { label: '최다 포인트 팀', value: topTeam ? topTeam.name : '데이터 없음' },
    {
      label: '누적 포인트',
      value: teams.reduce((sum, team) => sum + (team.total_points ?? 0), 0).toLocaleString(),
    },
  ];

  return (
    <ResourceTablePage
      eyebrow="Teams"
      title="팀 관리 보드"
      description="팀 주장, 모토, 인원 수와 포인트 집계를 한눈에 확인할 수 있습니다."
      endpoint={resolveTeamsEndpoint(apiBaseUrl)}
      rows={teams}
      columns={columns}
      stats={stats}
      loading={loading}
      error={error}
      onRefresh={() => loadTeams()}
      emptyMessage="표시할 팀 데이터가 없습니다."
      searchPlaceholder="팀명, 주장, 유니버스 또는 모토로 검색"
      detailTitle={(team) => `${team.name} 상세 정보`}
    />
  );
}

export default Teams;