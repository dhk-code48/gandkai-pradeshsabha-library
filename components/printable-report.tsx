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
    <div className="flex min-h-screen w-screen flex-col items-center justify-center overflow-y-scroll">
      <div className="h-[29.7cm] w-[21cm] space-y-10 p-[34px]">
        <div className="px-10 flex items-center justify-between gap-x-5 text-center">
          <Image
            alt="logo gandaki pradesh sabha"
            width={50}
            height={50}
            src="/logo.jpg"
            className="h-[100px] w-[100px]"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-wider text-[#dc143c]">
              गण्डकी प्रदेश सभा पुस्तकालय
            </h1>
            <p className="font-bold text-[#2760b8]">गण्डकी प्रदेश</p>
            <p className="text-sm font-bold text-[#2760b8]">नदीपुर, पोखरा, नेपाल</p>
          </div>
          <Image
            width={49}
            height={50}
            alt="nepal flag"
            src="/flag.webp"
            className="h-[100px] w-[100px]"
          />
        </div>

        <div className="space-y-1 pt-10 text-center">
          <h1 className="text-[28px] font-bold">पुस्तकालय रिपोर्ट</h1>

          <p className="text-[20px] font-bold text-gray-600">
            जारी मिति {moment(new Date()).format("YYYY - MM - DD")}
          </p>
        </div>
        <div className="flex w-full items-center justify-center gap-x-10 py-20">
          <div className="h-[150px] w-[3px] bg-black"></div>
          <div className="h-[200px] w-[3px] bg-black"></div>
          <div className="h-[150px] w-[3px] bg-black"></div>
        </div>
        <div className="px-20 text-center">
          <p>
            यस प्रतिवेदनले {moment(startDate).format("YYYY - MM - DD")} देखि{" "}
            {moment(endDate).format("YYYY - MM - DD")} सम्म जारी गरिएको पुस्तकालय वस्तुहरूको विस्तृत
            सारांश प्रदान गर्दछ।
          </p>
        </div>
      </div>
      <div className="relative min-h-[29.7cm] w-[21cm] p-[24px]">
        <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-center">
          <Image
            alt="gandaki pradesh"
            width={200}
            height={200}
            src="/logo.png"
            className="h-[170px] w-[200px] opacity-10"
          />
        </div>
        <div className="space-y-3 mt-10">
          <h3 className="text-lg font-bold text-gray-800 text-center">जारी गरिएका पुस्तकहरू</h3>
          <Table className="table-auto w-full">
            <TableCaption>
              {moment(startDate).format("MMM Do YYYY")} देखि {moment(endDate).format("MMM Do YYYY")}{" "}
              को बीचमा जारी गरिएका पुस्तकहरूको सूची।
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Returned Date</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {reportInfo.returnRecords.map((record, i) => (
                <TableRow key={"returnRecordInfo" + i + 1}>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>{record.bookName}</TableCell>
                  <TableCell>{record.book ? record.book.authors : " - "}</TableCell>
                  <TableCell>{record.book ? record.book.stock : " - "}</TableCell>
                  <TableCell>{moment(record.issuedDate).format("MMM Do YYYY")}</TableCell>
                  <TableCell>{moment(record.createdAt).format("MMM Do YYYY")}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="space-y-3 mt-20">
          <h3 className="text-lg font-bold text-gray-800 text-center">
            फिर्ता गर्न बाँकी किताबहरू
          </h3>
          <Table className="table-auto w-full">
            <TableCaption>
              A list of book yet to return as of {moment(endDate).format("MMM Do YYYY")}{" "}
            </TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Time Since Issued</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {reportInfo.issueRecords.map((record, i) => (
                <TableRow key={"issueRecord" + i + 1}>
                  <TableCell>{record.user.name}</TableCell>
                  <TableCell>{record.book.name}</TableCell>
                  <TableCell>{record.book.authors}</TableCell>
                  <TableCell>{record.book.stock}</TableCell>
                  <TableCell>{moment(record.createdAt).format("MMM Do YYYY")}</TableCell>
                  <TableCell>{moment(record.createdAt).fromNow()} since Issued</TableCell>
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
