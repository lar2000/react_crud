
// eslint-disable-next-line react/prop-types
const Pagination = ({ total, length, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(total / length);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const start = (currentPage - 1) * length + 1;
  const end = Math.min(currentPage * length, total);

  return (
    <div className="row mt-2 justify-content-between">
      <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto ms-auto">
        <div className="dt-info" aria-live="polite" role="status">
          Showing {start} to {end} of {total} entries
        </div>
        <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-2">
          <nav aria-label="pagination">
            <ul className="pagination">
              <li className={`dt-paging-button page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link first" onClick={() => goToPage(1)} disabled={currentPage === 1} aria-label="First">
                  «
                </button>
              </li>
              <li className={`dt-paging-button page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link previous" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous">
                  ‹
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <li key={page} className={`dt-paging-button page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => goToPage(page)}>
                  {page}
                </button>
              </li>
              ))}
              <li className={`dt-paging-button page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link next" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next">
                  ›
                </button>
              </li>
              <li className={`dt-paging-button page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link last" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} aria-label="Last">
                  »
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
