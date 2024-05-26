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
import ReactToPrint from "react-to-print";

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
  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [text, setText] = React.useState<string>("old boring text");

  const handleAfterPrint = React.useCallback((): void => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = React.useCallback((): void => {
    console.log("`onBeforePrint` called");
  }, []);
  const handleOnBeforeGetContent = React.useCallback((): Promise<void> => {
    console.log("`onBeforeGetContent` called");
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  React.useEffect(() => {
    if (text === "New, Updated Text!" && typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [text]);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback((): React.ReactElement => {
    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
    // to the root node of the returned component as it will be overwritten.

    // Bad: the `onClick` here will be overwritten by `react-to-print`
    // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

    // Good
    return (
      <Button className="gap-x-3 fixed z-50 top-10">
        Print <Printer size={14} />
      </Button>
    );
  }, []);

  return (
    <div className="space-y-10">
      {openPrint && reportInfo && (
        <div className="fixed z-50 top-0 left-0 w-screen overflow-y-scroll h-screen bg-white">
          <div className="flex h-full w-full items-center justify-center">
            <ReactToPrint
              content={reactToPrintContent}
              documentTitle="AwesomeFileName"
              onAfterPrint={handleAfterPrint}
              onBeforeGetContent={handleOnBeforeGetContent}
              onBeforePrint={handleBeforePrint}
              removeAfterPrint
              trigger={reactToPrintTrigger}
            />
            {loading && <p className="indicator">onBeforeGetContent: Loading...</p>}
            <div id="report" ref={componentRef}>
              <PrintableReport reportInfo={reportInfo} endDate={endDate} startDate={startDate} />
            </div>
          </div>
          <div
            id="hideItWhilePrinting"
            className="fixed gap-y-5 top-10 right-10 flex flex-col z-[60]"
          >
            <Button variant="destructive" onClick={() => setOpenPrint(false)}>
              <X />
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
