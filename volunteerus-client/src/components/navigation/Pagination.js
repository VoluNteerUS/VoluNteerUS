import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({ totalPages, currentPage, totalItems, limit, handlePageChange, handlePrevPage, handleNextPage }) {
  return (
    <>
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-pink-400">
            Previous
          </a>
          <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-pink-400">
            Next
          </a>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{ (totalItems === 0) ? 0 : ((currentPage - 1) * limit) + 1} </span> to <span className="font-medium">{(currentPage * limit > totalItems) ? totalItems : currentPage * limit}</span> of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                className="relative inline-flex items-center px-2 py-2 
                  rounded-l-md border border-gray-300 bg-white text-sm 
                  font-medium text-gray-500 hover:bg-pink-400"
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {
                (totalPages > 6) ? (currentPage < 4) ? (
                  <>
                    {
                      Array.from({ length: 4 }, (_, i) => i + 1).map((page, key) => (
                        <a
                          key={key}
                          href="#"
                          aria-current="page"
                          className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </a>
                      ))
                    }
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </a>
                  </>
                ) : (currentPage > totalPages - 3) ? (
                  <>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    {
                      Array.from({ length: 4 }, (_, i) => i + totalPages - 3).map((page, key) => (
                        <a
                          key={key}
                          href="#"
                          aria-current="page"
                          className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </a>
                      ))
                    }
                  </>
                ) : (
                  <>
                    <a href="#" className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                      1
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a href="#" className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                      {currentPage - 1}
                    </a>
                    <a href="#" aria-current="page" className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                      {currentPage}
                    </a>
                    <a href="#" className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                      {currentPage + 1}
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <a href="#" className="z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                      {totalPages}
                    </a>
                  </>
                ) : Array.from(Array(totalPages), (e, i) => {
                  return (
                    <button
                      key={i}
                      className={
                        currentPage === i + 1 ?
                          "z-10 bg-pink-400 text-white relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                          : "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      }
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                })
              }
              <button
                className="relative inline-flex items-center 
                  px-2 py-2 rounded-r-md border border-gray-300 
                bg-white text-sm font-medium text-gray-500 hover:bg-pink-400"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}