"use client";
import { Heading } from "@/components/ui/heading";
import React, { useState } from "react";
import DatePicker from "./_components/date-picker";
import { Button } from "@/components/ui/button";
import { start } from "repl";
import getReportInfo, { ReportInfoProp } from "@/actions/getReportInfo";
import { Printer, X } from "lucide-react";
import PrintableReport from "@/components/printable-report";
import { Book, User } from "@prisma/client";
import { useReactToPrint } from "react-to-print";

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [issueData, setIssueData] = useState();
  const [openPrint, setOpenPrint] = useState<boolean>(false);
  const [reportInfo, setReportInfo] = useState<ReportInfoProp>();

  async function generateReport() {
    if (!startDate || !endDate || startDate > endDate) {
      window.alert("From and To Date must be valid");
    } else {
      const reportInfo = await getReportInfo(startDate.toISOString(), endDate.toISOString());

      setReportInfo(reportInfo);
      setOpenPrint(true);
    }
  }
  const componentRef = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    removeAfterPrint: true,
  });

  return (
    <div className="space-y-10">
      {openPrint && reportInfo && (
        <div className="fixed z-50 top-0 left-0 w-screen overflow-y-scroll h-screen bg-white">
          <div id="report" ref={componentRef}>
            <PrintableReport reportInfo={reportInfo} endDate={endDate} startDate={startDate} />
          </div>
          <div
            id="hideItWhilePrinting"
            className="fixed gap-y-5 top-10 right-10 flex flex-col z-[60]"
          >
            <Button variant="destructive" onClick={() => setOpenPrint(false)}>
              <X />
            </Button>
            <Button className="gap-x-3" onClick={() => handlePrint()}>
              Print <Printer size={14} />
            </Button>
          </div>
        </div>
      )}

      <Heading
        title={`Report Generation`}
        description="Generate Report Of Library Between Two Dates"
      />

      <div className="space-y-5">
        <h1 className="text-xl font-bold">Choose Two Dates</h1>
        <div className="flex gap-x-10">
          <div className="space-y-1">
            <p className="font-semibold">From :</p>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">To :</p>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
        </div>
      </div>
      <Button onClick={generateReport}>Generate Reports</Button>
    </div>
  );
};

export default ReportGenerator;
