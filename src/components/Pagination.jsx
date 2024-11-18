import PropTypes from 'prop-types';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    className = "" 
}) => {
    if (totalPages <= 1) return null;

    const generatePageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    const PageButton = ({ page, isCurrent }) => (
        <button
            className={`join-item btn btn-sm ${isCurrent ? "btn-active" : ""}`}
            onClick={() => onPageChange(page)}
            disabled={typeof page === "string"}
        >
            {page}
        </button>
    );

    PageButton.propTypes = {
        page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        isCurrent: PropTypes.bool.isRequired
    };

    return (
        <div className={`flex justify-center mt-4 ${className}`}>
            <div className="join">
                <button
                    className="join-item btn btn-sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    «
                </button>
                {generatePageNumbers().map((page, index) => (
                    <PageButton
                        key={`page-${index}`}
                        page={page}
                        isCurrent={currentPage === page}
                    />
                ))}
                <button
                    className="join-item btn btn-sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    »
                </button>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default Pagination;