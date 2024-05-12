import prismadb from "@/lib/prismadb";
import moment from "moment";
import { IssueRecordColumn } from "./_components/columns";
import { IssueRecordsClient } from "./_components/client";

const IssueRecordsPage = async () => {
  const issueRecords = await prismadb.returnRecord.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedRecords: IssueRecordColumn[] = issueRecords.map((item) => ({
    id: item.id,
    name: item.userName,
    book: item.bookName,
    createdAt: moment(item.updatedAt).format("MMMM Do YYYY").toString(),
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
