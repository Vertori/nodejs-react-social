interface PaginationClassicProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PaginationClassic = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationClassicProps) => {
  return (
    <div className="flex justify-center w-full py-10">
      <div className="mx-auto join">
        <button
          className="join-item btn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          «
        </button>
        <button className="join-item btn">Page {currentPage + 1}</button>
        <button
          className="join-item btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default PaginationClassic;
