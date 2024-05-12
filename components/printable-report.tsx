"use client";
import { ReportInfoProp } from "@/actions/getReportInfo";
import moment from "moment";
import Image from "next/image";
import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PrintableReport: FC<{
  startDate: Date | undefined;
  endDate: Date | undefined;
  reportInfo: ReportInfoProp;
}> = ({ endDate, startDate, reportInfo }) => {
  return (
    <div className="flex overflow-y-scroll min-h-screen w-screen items-center justify-center">
      <div className="w-[21cm] space-y-10 border p-[24px]">
        <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-center">
          <Image
            alt="gandaki pradesh"
            width={200}
            height={200}
            src="/gandakipradesh.png"
            className="h-[170px] w-[200px] opacity-10"
          />
        </div>
        <div className="flex items-center justify-between gap-x-5 text-center">
          <Image
            alt="logo gandaki pradesh sabha"
            width={50}
            height={50}
            src="/logo.jpg"
            className="h-[50px] w-[50px]"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-wider text-[#dc143c]">
              गण्डकी प्रदेश सभा पुस्तकालय
            </h1>
            <p className="font-bold text-[#2760b8]">नदीपुर, पोखरा, नेपाल</p>
          </div>
          <Image
            width={49}
            height={50}
            alt="nepal flag"
            src="/flag.webp"
            className="h-[50px] w-[49px]"
          />
        </div>
        <hr />
        <div className="text-center">
          <h1 className="text-xl font-bold">Library Report</h1>
          <p>
            From {moment(startDate).format("MMM Do YYYY")} to{" "}
            {moment(endDate).format("MMM Do YYYY")}
          </p>
          <p>
            This report provides a detailed summary of library items issued during the specified
            period.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Basic Stastits</h3>
          <p>Total Number of Books Issued : {reportInfo.totalBooksIssued}</p>
          <p>Average issue duration : {reportInfo.averageIssueDuration}</p>
          <p>
            Most popular book :{reportInfo.mostPopularBook?.name} (Issued{" "}
            {reportInfo.mostPopularBookIssuesCount} times)
          </p>
          <p />
          <div>
            <p>Top borrowers :</p>
            {reportInfo.topBorrowers?.map((issue, i) => (
              <p key={"topBorrowers" + i + 1} className="ml-5">
                {i + 1}. {issue.user?.name} - Borrow {issue.borrowedBooksCount} Books
              </p>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Issued Items</h3>
          <Table className="table-auto w-full">
            <TableCaption>
              A list of book yet to return in Between
              {moment(startDate).format("MMM Do YYYY")} to {moment(endDate).format("MMM Do YYYY")}.
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Returned Date</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {reportInfo.returnRecords.map((record, i) => (
                <TableRow key={"returnRecordInfo" + i + 1}>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>{record.bookName}</TableCell>
                  <TableCell>{moment(record.issuedDate).format("MMM Do YYYY")}</TableCell>
                  <TableCell>{moment(record.createdAt).format("MMM Do YYYY")}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>{" "}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Books Yet To Return</h3>
          <Table className="table-auto w-full">
            <TableCaption>
              A list of book issued and returned in Between
              {moment(startDate).format("MMM Do YYYY")} to {moment(endDate).format("MMM Do YYYY")}.
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Returned Date</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {reportInfo.issueRecords.map((record, i) => (
                <TableRow key={"issueRecord" + i + 1}>
                  <TableCell>{record.user.name}</TableCell>
                  <TableCell>{record.book.name}</TableCell>
                  <TableCell>{moment(record.createdAt).format("MMM Do YYYY")}</TableCell>
                  <TableCell>
                    Yet To Return ({moment(record.createdAt).fromNow()} since Issued)
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;
