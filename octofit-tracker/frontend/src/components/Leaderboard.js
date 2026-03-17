import { useCallback, useEffect, useMemo, useState } from 'react';
import ResourceTablePage from './ResourceTablePage';
import { extractCollection, logFetchedCollection } from '../utils/api';

function resolveLeaderboardEndpoint(apiBaseUrl) {
  if (apiBaseUrl) {
    return `${apiBaseUrl}/leaderboard/`;
  }

  if (process.env.REACT_APP_CODESPACE_NAME) {
    return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
  }

  return 'http://localhost:8000/api/leaderboard/';
}

function formatDate(value) {
  if (!value) {
    return '날짜 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function Leaderboard({ apiBaseUrl }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = useCallback(
    async (signal) => {
      setLoading(true);
      setError('');

      try {
        const endpoint = resolveLeaderboardEndpoint(apiBaseUrl);
        const response = await fetch(endpoint, {
          signal,
        });

        if (!response.ok) {
          throw new Error(`리더보드 데이터를 불러오지 못했습니다. (${response.status})`);
        }

        const payload = await response.json();
        const collection = extractCollection(payload);

        logFetchedCollection('leaderboard', endpoint, payload, collection);
        setEntries(collection);
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

    loadEntries(controller.signal);

    return () => controller.abort();
  }, [loadEntries]);

  const groupedEntries = entries.reduce((groups, entry) => {
    const categoryEntries = groups[entry.category] ?? [];
    categoryEntries.push(entry);
    groups[entry.category] = categoryEntries;
    return groups;
  }, {});
  const topEntry = entries.reduce((bestEntry, currentEntry) => {
    if (!bestEntry) {
      return currentEntry;
    }

    return currentEntry.score > bestEntry.score ? currentEntry : bestEntry;
  }, null);

  const columns = useMemo(
    () => [
      { key: 'category', label: '카테고리', value: (entry) => entry.category },
      { key: 'rank', label: '순위', value: (entry) => `#${entry.rank}` },
      { key: 'display_name', label: '이름', value: (entry) => entry.display_name },
      { key: 'team_name', label: '팀', value: (entry) => entry.team_name },
      { key: 'score', label: '점수', value: (entry) => entry.score },
      { key: 'recorded_on', label: '기준일', value: (entry) => formatDate(entry.recorded_on) },
    ],
    []
  );

  const stats = [
    { label: '기록 수', value: entries.length },
    { label: '카테고리 수', value: Object.keys(groupedEntries).length },
    {
      label: '최고 점수',
      value: topEntry ? `${topEntry.display_name} · ${topEntry.score}` : '데이터 없음',
    },
  ];

  return (
    <ResourceTablePage
      eyebrow="Leaderboard"
      title="경쟁형 리더보드"
      description="카테고리별 순위와 점수를 일관된 테이블 레이아웃으로 확인할 수 있습니다."
      endpoint={resolveLeaderboardEndpoint(apiBaseUrl)}
      rows={entries}
      columns={columns}
      stats={stats}
      loading={loading}
      error={error}
      onRefresh={() => loadEntries()}
      emptyMessage="표시할 리더보드 데이터가 없습니다."
      searchPlaceholder="카테고리, 이름, 팀 또는 점수로 검색"
      detailTitle={(entry) => `${entry.display_name} 리더보드 상세`}
    />
  );
}

export default Leaderboard;