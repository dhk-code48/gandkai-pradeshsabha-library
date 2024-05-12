import prismadb from "@/lib/prismadb";

import { BookForm } from "./_components/book-form";
import { IssueRecordColumn, columns } from "../../issueRecords/_components/columns";
import moment from "moment";
import { Heading } from "@/components/ui/heading";
import { DataTable } from "@/components/ui/data-table";

const BookPage = async ({ params }: { params: { bookId: string; schoolId: string } }) => {
  const book = await prismadb.book.findUnique({
    where: {
      id: params.bookId,
    },
    include: {
      issues: {
        include: {
          user: true,
        },
      },
    },
  });
  const shelfs = await prismadb.shelf.findMany({});

  const formattedRecords: IssueRecordColumn[] | null =
    book &&
    book.issues.map((item) => ({
      id: item.id,
      book: book,
      bookId: item.bookId,
      userId: item.user.id,
      userName: item.user.name || "",
      createdAt: moment(item.createdAt).format("MMMM Do YYYY").toString(),
      issuedDate: item.createdAt,
    }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BookForm initialData={book} shelfs={shelfs} />
      </div>
      {book && (
        <Heading
          title={book.name + " Issue Record"}
          description="View and menage members record directly from here"
        />
      )}
      {formattedRecords && <DataTable columns={columns} data={formattedRecords} searchKey="name" />}
    </div>
  );
};

export default BookPage;
