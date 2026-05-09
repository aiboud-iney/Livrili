"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  const getPages = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  const btnBase: React.CSSProperties = {
    width: "36px", height: "36px", borderRadius: "50%",
    border: "1.5px solid transparent", cursor: "pointer",
    fontSize: "13px", fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.15s",
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
      {}
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{ ...btnBase, color: currentPage === 1 ? "#d1d5db" : "#374151", backgroundColor: "transparent", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.backgroundColor = "#f3f4f6" }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
      >‹</button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`dot-${i}`} style={{ width: "36px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            style={{ ...btnBase, backgroundColor: currentPage === page ? "#7C3AED" : "transparent", color: currentPage === page ? "#fff" : "#374151", borderColor: currentPage === page ? "#7C3AED" : "transparent", boxShadow: currentPage === page ? "0 2px 8px rgba(124,58,237,0.3)" : "none" }}
            onMouseEnter={(e) => { if (currentPage !== page) e.currentTarget.style.backgroundColor = "#f3f4f6" }}
            onMouseLeave={(e) => { if (currentPage !== page) e.currentTarget.style.backgroundColor = "transparent" }}
          >{page}</button>
        )
      )}

      {}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{ ...btnBase, color: currentPage === totalPages ? "#d1d5db" : "#374151", backgroundColor: "transparent", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
        onMouseEnter={(e) => { if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = "#f3f4f6" }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
      >›</button>
    </div>
  )
}