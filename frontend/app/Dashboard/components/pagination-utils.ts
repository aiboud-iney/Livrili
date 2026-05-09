export type PaginationItem = number | "ellipsis";

export function getVisiblePages(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages]);

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let page = startPage; page <= endPage; page += 1) {
    pages.add(page);
  }

  if (currentPage <= 3) {
    for (let page = 2; page <= 4 && page < totalPages; page += 1) {
      pages.add(page);
    }
  }

  if (currentPage >= totalPages - 2) {
    for (
      let page = Math.max(2, totalPages - 3);
      page <= totalPages - 1;
      page += 1
    ) {
      pages.add(page);
    }
  }

  const sortedPages = Array.from(pages).sort((left, right) => left - right);
  const visiblePages: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (index > 0 && page - previousPage > 1) {
      visiblePages.push("ellipsis");
    }

    visiblePages.push(page);
  });

  return visiblePages;
}
