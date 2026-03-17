import { useMemo, useState } from 'react';

function normalizeValue(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  return value;
}

function toSearchText(row, columns) {
  return columns
    .map((column) => {
      if (column.searchValue) {
        return column.searchValue(row);
      }

      if (column.value) {
        return column.value(row);
      }

      return '';
    })
    .join(' ')
    .toLowerCase();
}

function ResourceTablePage({
  eyebrow,
  title,
  description,
  endpoint,
  rows,
  columns,
  stats,
  loading,
  error,
  onRefresh,
  emptyMessage,
  searchPlaceholder,
  detailTitle,
}) {
  const [query, setQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredRows = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return rows;
    }

    return rows.filter((row) => toSearchText(row, columns).includes(trimmedQuery));
  }, [columns, query, rows]);

  return (
    <section className="resource-page container-fluid px-0">
      <div className="card shadow-sm border-0 resource-card">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-start">
            <div>
              <p className="text-uppercase small fw-semibold text-success mb-2 letter-spacing-wide">
                {eyebrow}
              </p>
              <h2 className="h1 fw-bold mb-3">{title}</h2>
              <p className="text-secondary mb-0 resource-copy">{description}</p>
            </div>
            <div className="text-lg-end">
              <div className="small text-uppercase text-secondary fw-semibold mb-2">
                REST API
              </div>
              <a
                className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                href={endpoint}
                target="_blank"
                rel="noreferrer"
              >
                {endpoint}
              </a>
            </div>
          </div>

          <div className="row g-3 mt-1">
            {stats.map((stat) => (
              <div className="col-12 col-md-6 col-xl-3" key={stat.label}>
                <div className="card h-100 border-0 bg-light stat-surface">
                  <div className="card-body">
                    <div className="text-secondary small text-uppercase fw-semibold mb-2">
                      {stat.label}
                    </div>
                    <div className="h3 mb-0 fw-bold">{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm mt-4 table-shell">
            <div className="card-body p-3 p-lg-4">
              <div className="row g-3 align-items-end mb-3">
                <div className="col-12 col-lg-7">
                  <label className="form-label fw-semibold" htmlFor={`${eyebrow}-search`}>
                    데이터 검색
                  </label>
                  <input
                    id={`${eyebrow}-search`}
                    className="form-control"
                    type="search"
                    value={query}
                    placeholder={searchPlaceholder}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className="col-12 col-lg-5">
                  <div className="d-flex gap-2 justify-content-lg-end">
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={() => onRefresh()}
                    >
                      새로고침
                    </button>
                    <a
                      className="btn btn-link link-primary text-decoration-none"
                      href={endpoint}
                      target="_blank"
                      rel="noreferrer"
                    >
                      API 열기
                    </a>
                  </div>
                </div>
              </div>

              {loading ? <div className="alert alert-info mb-0">데이터를 불러오는 중입니다.</div> : null}
              {error ? <div className="alert alert-danger mb-0">{error}</div> : null}

              {!loading && !error ? (
                filteredRows.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 octofit-table">
                      <thead className="table-light">
                        <tr>
                          {columns.map((column) => (
                            <th key={column.key} scope="col">
                              {column.label}
                            </th>
                          ))}
                          <th scope="col" className="text-end">
                            작업
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row) => (
                          <tr key={row.id}>
                            {columns.map((column) => {
                              const rawValue = column.value ? column.value(row) : row[column.key];
                              const cellValue = column.render
                                ? column.render(row)
                                : normalizeValue(rawValue);

                              return <td key={`${row.id}-${column.key}`}>{cellValue}</td>;
                            })}
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-primary"
                                type="button"
                                onClick={() => setSelectedRow(row)}
                              >
                                상세 보기
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-secondary mb-0">{emptyMessage}</div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {selectedRow ? (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header">
                  <h3 className="modal-title h4 mb-0">{detailTitle(selectedRow)}</h3>
                  <button
                    className="btn-close"
                    type="button"
                    aria-label="닫기"
                    onClick={() => setSelectedRow(null)}
                  />
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0 octofit-table">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">항목</th>
                          <th scope="col">값</th>
                        </tr>
                      </thead>
                      <tbody>
                        {columns.map((column) => {
                          const rawValue = column.value
                            ? column.value(selectedRow)
                            : selectedRow[column.key];

                          return (
                            <tr key={`detail-${column.key}`}>
                              <th scope="row">{column.label}</th>
                              <td>{normalizeValue(rawValue)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setSelectedRow(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show app-modal-backdrop" />
        </>
      ) : null}
    </section>
  );
}

export default ResourceTablePage;