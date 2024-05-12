import OverviewCard from "@/components/overview-card";
import prismadb from "@/lib/prismadb";
import { Book } from "lucide-react";
import React from "react";

const DashboardOverview = async () => {
  const bookInfo = await prismadb.book.aggregate({
    _sum: {
      total: true,
      stock: true,
    },
  });
  const issueInfo = await prismadb.issueRecord.count();
  const totalMembers = await prismadb.user.count({ where: { role: "MEMBER" } });
  return (
    <div className="flex gap-5 flex-wrap">
      <OverviewCard
        amount={totalMembers}
        description="Total members enrolled in library"
        icon={<Book />}
        title="Total Members"
      />
      <OverviewCard
        amount={bookInfo._sum.total || ""}
        description="Total books added in the library"
        icon={<Book />}
        title="Total Books"
      />
      <OverviewCard
        amount={bookInfo._sum.stock || ""}
        description="Total books available in the library as of now"
        icon={<Book />}
        title="Total Book In Stock"
      />
      <OverviewCard
        amount={issueInfo}
        description="Total book issued by library"
        icon={<Book />}
        title="Total Book Issued"
      />
    </div>
  );
};

export default DashboardOverview;
