"use server";
import prismadb from "@/lib/prismadb";
import { Book, IssueRecord, ReturnRecord, User } from "@prisma/client";

export interface ReportInfoProp {
  totalBooksIssued: number;
  totalBookNotReturned: number;
  averageIssueDuration: number;
  mostPopularBook: Book | null;
  topBorrowers: { user: User | null; borrowedBooksCount: number }[];
  mostPopularBookIssuesCount: number;
  issueRecords: (IssueRecord & { user: User; book: Book })[];
  returnRecords: (ReturnRecord & { book: Book | null })[];
}

export default async function getReportInfo(fromDate: string, toDate: string): Promise<ReportInfoProp> {
  const returnRecords = await prismadb.returnRecord.findMany({
    where: {
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      book: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  const issueRecords = await prismadb.issueRecord.findMany({
    where: {
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      user: true,
      book: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log("ISSUE RECORDS = > ", issueRecords);
  console.log("RETURN RECORDS = > ", returnRecords);

  // 1. Calculate Average Issue Duration
  const issueDurations = returnRecords.map((record: ReturnRecord) => {
    const durations = record.createdAt.getTime() - record.issuedDate.getTime();
    return durations / (1000 * 60 * 60 * 24);
  });

  const averageIssueDuration =
    issueDurations.reduce((acc: number, curr: number) => acc + curr, 0) / issueDurations.length;

  // 2. Find Most Popular Book

  const bookCounts: Record<string, number> = {};
  returnRecords.forEach((record: ReturnRecord) => {
    const bookId = record.bookId;
    bookId && (bookCounts[bookId] = (bookCounts[bookId] || 0) + 1);
  });

  const mostPopularBookId = Object.keys(bookCounts).reduce((a: string, b: string) =>
    bookCounts[a] > bookCounts[b] ? a : b
  );

  const mostPopularBook = await prismadb.book.findUnique({
    where: { id: mostPopularBookId },
  });

  const mostPopularBookIssuesCount: number = bookCounts[mostPopularBookId] || 0;

  // 3. Find Top Borrowers

  const userCounts: Record<string, number> = {};

  returnRecords.forEach((record: ReturnRecord) => {
    const userId = record.userId;
    userCounts[userId] = (userCounts[userId] || 0) + 1;
  });

  const sortedUserIds = Object.keys(userCounts).sort((a: string, b: string) => userCounts[b] - userCounts[a]);

  const topBorrowers: { user: User | null; borrowedBooksCount: number }[] = await Promise.all(
    sortedUserIds.slice(0, 5).map(async (userId: string) => {
      const user: User | null = await prismadb.user.findUnique({ where: { id: userId } });
      return { user, borrowedBooksCount: userCounts[userId] };
    })
  );

  // 4. Total Books Issued
  const totalBooksIssued = returnRecords.length + issueRecords.length;

  return {
    totalBooksIssued,
    totalBookNotReturned: issueRecords.length,
    averageIssueDuration,
    mostPopularBook,
    topBorrowers,
    mostPopularBookIssuesCount,
    issueRecords,
    returnRecords,
  };
}
