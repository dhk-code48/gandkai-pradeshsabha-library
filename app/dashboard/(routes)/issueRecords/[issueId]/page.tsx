import prismadb from "@/lib/prismadb";

import { IssueForm } from "./_components/issue-form";

const IssuePage = async ({ params }: { params: { issueId: string } }) => {
  const issueRecord = await prismadb.issueRecord.findUnique({
    where: {
      id: params.issueId,
    },
    include: {
      book: true,
      user: true,
    },
  });

  const members = await prismadb.user.findMany({});

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <IssueForm initialData={issueRecord} members={members} />
      </div>
    </div>
  );
};

export default IssuePage;
