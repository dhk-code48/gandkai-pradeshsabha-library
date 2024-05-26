"use client";
import React, { useState, useEffect } from "react";
import { Book } from "@prisma/client";
import BookFilter from "./_components/book-filter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { fetchBooks } from "@/actions/getBooks";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const HomeBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(9);
  const [totalBooks, setTotalBooks] = useState(0);
  const [bookName, setBookName] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      const { books, pagination } = await fetchBooks(currentPage, booksPerPage, bookName);

      setBooks(books);
      setTotalBooks(pagination.totalCount);
    };

    fetchAll();
  }, [currentPage, bookName, booksPerPage]);

  const handleBookNameChange = (value: string) => {
    setBookName(value);
  };

  // Pagination Controls
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mt-10 space-y-10">
      <div className="flex items-center gap-x-3">
        <Input
          placeholder="Search Books ..."
          onChange={(e) => handleBookNameChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-10 items-stretch lg:justify-start justify-center">
        {books &&
          books.map((book) => (
            <Link href={"/member/" + book.id} key={book.id + "bookfilter"}>
              <Card className="w-[400px] h-full">
                <CardHeader>
                  <CardTitle className="text-left tracking-wide leading-78">{book.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p>Authors : {book.authors}</p>
                  <p>Publication : {book.publication}</p>
                  <div
                    className={cn(
                      "px-3 rounded-full w-fit",
                      book.stock > 0 ? "bg-green-500" : "bg-red-500"
                    )}
                  >
                    {book.stock > 0 ? "Available" : "Out of stock"}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <>
              <PaginationItem onClick={() => setCurrentPage(1)}>
                <PaginationLink href="#">&#60;&#60;</PaginationLink>
              </PaginationItem>
              <PaginationItem onClick={prevPage}>
                <PaginationPrevious href="#" />
              </PaginationItem>
            </>
          )}
          {[...Array.from({ length: totalPages }, (_, i) => i)].map((page) => {
            if (currentPage - 3 <= page && page <= currentPage + 3)
              return (
                <PaginationItem key={page} onClick={() => setCurrentPage(page + 1)}>
                  <PaginationLink href="#" isActive={currentPage === page + 1}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              );
          })}
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {currentPage < totalPages && (
            <>
              <PaginationItem onClick={nextPage}>
                <PaginationNext href="#" />
              </PaginationItem>
              <PaginationItem onClick={() => setCurrentPage(totalPages)}>
                <PaginationLink href="#">&#62;&#62;</PaginationLink>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default HomeBooks;
