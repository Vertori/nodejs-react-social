import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { setPage } from "../features/category/categorySlice";

const PaginationHome = () => {
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.category.page);
  const category = useSelector((state: RootState) => state.category.category);
  const totalPages = useSelector(
    (state: RootState) => state.category.totalPages
  );

  return (
    <div className="flex justify-center w-full py-10">
      <div className="mx-auto join">
        <button
          className="join-item btn"
          disabled={page === 0}
          onClick={() => dispatch(setPage(page - 1))}
        >
          «
        </button>
        <button className="join-item btn">Page {page + 1}</button>
        <button
          className="join-item btn"
          disabled={
            page === totalPages - 1 || (category !== "" && totalPages === 1)
          }
          onClick={() => dispatch(setPage(page + 1))}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default PaginationHome;
