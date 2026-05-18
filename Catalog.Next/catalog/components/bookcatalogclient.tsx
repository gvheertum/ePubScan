'use client'

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import ReadStatusBadge from "./readstatusbadge";
import { IBookCatalogItem, ReadStateElement, ReadStates } from "../lib/IBook";

type CatalogProps = {
  initialBooks: IBookCatalogItem[];
};

const readStates = new ReadStates();

export default function BookCatalogClient({ initialBooks }: CatalogProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReadStateElement>(readStates.All);
  const deferredSearch = useDeferredValue(searchValue);
  const normalizedSearch = deferredSearch.trim().toLocaleLowerCase();

  const books = initialBooks.filter((book) => {
    const statusMatch =
      filterStatus.matches(readStates.All.code) ||
      filterStatus.matches(book.ReadStatus);

    if (!statusMatch) {
      return false;
    }

    if (normalizedSearch.length === 0) {
      return true;
    }

    const haystack = [
      book.Title ?? "",
      book.Author ?? "",
      book.Medium ?? "",
      book.Status ?? "",
    ]
      .join(" ")
      .toLocaleLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const stats = {
    total: initialBooks.length,
    visible: books.length,
    read: initialBooks.filter((book) => readStates.Read.matches(book.ReadStatus)).length,
    reading: initialBooks.filter((book) => readStates.Reading.matches(book.ReadStatus)).length,
  };

  return (
    <div className="catalog-shell">
      <section className="catalog-hero">
        <div>
          <p className="catalog-eyebrow">Personal Library</p>
          <h1>Book catalog</h1>
          <p className="catalog-subtitle">
            A cleaner view over the collection with lightweight reads and faster server-side caching.
          </p>
        </div>
        <div className="catalog-stats">
          <div className="catalog-stat-card">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="catalog-stat-card">
            <span>Visible</span>
            <strong>{stats.visible}</strong>
          </div>
          <div className="catalog-stat-card">
            <span>Read</span>
            <strong>{stats.read}</strong>
          </div>
          <div className="catalog-stat-card">
            <span>Reading</span>
            <strong>{stats.reading}</strong>
          </div>
        </div>
      </section>

      <section className="catalog-toolbar">
        <label className="catalog-search">
          <span>Search title, author, medium, status</span>
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search your shelf"
          />
        </label>

        <div className="catalog-filters">
          <FilterButton active={filterStatus.matches(readStates.All.code)} label="All" onClick={() => setFilterStatus(readStates.All)} />
          <FilterButton active={filterStatus.matches(readStates.Read.code)} label="Read" onClick={() => setFilterStatus(readStates.Read)} />
          <FilterButton active={filterStatus.matches(readStates.Reading.code)} label="Reading" onClick={() => setFilterStatus(readStates.Reading)} />
          <FilterButton active={filterStatus.matches(readStates.ToRead.code)} label="To Read" onClick={() => setFilterStatus(readStates.ToRead)} />
          <FilterButton active={filterStatus.matches(readStates.WontRead.code)} label="Won't Read" onClick={() => setFilterStatus(readStates.WontRead)} />
          <FilterButton active={filterStatus.matches(readStates.Unknown.code)} label="Unknown" onClick={() => setFilterStatus(readStates.Unknown)} />
        </div>
      </section>

      <section className="catalog-list" aria-live="polite">
        {books.map((book) => (
          <article className="catalog-row" key={book.BookID}>
            <div className="catalog-row-main">
              <div className="catalog-row-titleline">
                <ReadStatusBadge readStatus={book.ReadStatus} />
                <div>
                  <h2>{book.Title || "Untitled book"}</h2>
                  <p>{book.Author || "Unknown author"}</p>
                </div>
              </div>
              <div className="catalog-row-meta">
                <span>{book.Medium || "Unknown medium"}</span>
                <span>{book.NrOfPages ? `${book.NrOfPages} pages` : "Page count unknown"}</span>
                <span>{book.Status || "No availability state"}</span>
              </div>
            </div>
            <div className="catalog-row-side">
              <span className="catalog-book-id">#{book.BookID}</span>
              <Link href={`/book/${book.BookID}`} className="catalog-detail-link">
                Open details
              </Link>
            </div>
          </article>
        ))}

        {books.length === 0 && (
          <div className="catalog-empty">
            <h2>No books match this filter</h2>
            <p>Try a broader search or switch back to a wider read-status filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={active ? "catalog-filter active" : "catalog-filter"} onClick={onClick}>
      {label}
    </button>
  );
}
