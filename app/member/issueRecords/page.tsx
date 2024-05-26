import prismadb from "@/lib/prismadb";
import moment from "moment";
import { IssueRecordColumn } from "./_components/columns";
import { IssueRecordsClient } from "./_components/client";

const IssueRecordsPage = async () => {
  const issueRecords = await prismadb.issueRecord.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      book: true,
      user: true,
    },
  });

  const formattedRecords: IssueRecordColumn[] = issueRecords.map((item) => ({
    id: item.id,
    userName: item.user.name || "",
    userId: item.user.id,
    book: item.book,
    bookId: item.book.id,
    createdAt: moment(item.createdAt).format("MMMM Do YYYY").toString(),
    issuedDate: item.createdAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <IssueRecordsClient data={formattedRecords} />
      </div>
    </div>
  );
};

export default IssueRecordsPage;
