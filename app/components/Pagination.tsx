type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // Don't render pagination if there's only one page

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 rounded ${
            i === currentPage
              ? "bg-blue-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {renderPaginationButtons()}
    </div>
  );
};

export default Pagination;
