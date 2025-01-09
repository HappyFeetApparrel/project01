import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const getPageNumbers = () => {
    const visiblePages = 3; // Number of pages to show before the ellipsis
    const pageNumbers = [];

    if (totalPages <= visiblePages + 2) {
      // If total pages are small, show all pages
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else if (page <= visiblePages) {
      // Show the first few pages and the last page
      for (let i = 1; i <= visiblePages; i++) pageNumbers.push(i);
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (page > totalPages - visiblePages) {
      // Show the last few pages and the first page
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = totalPages - visiblePages + 1; i <= totalPages; i++)
        pageNumbers.push(i);
    } else {
      // Show the first page, current page range, and the last page
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (let i = page - 1; i <= page + 1; i++) pageNumbers.push(i);
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {getPageNumbers().map((pageNum, index) =>
        pageNum === "..." ? (
          <span key={`ellipsis-${index}`} className="text-gray-500">
            ...
          </span>
        ) : (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(pageNum as number)}
          >
            {pageNum}
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
