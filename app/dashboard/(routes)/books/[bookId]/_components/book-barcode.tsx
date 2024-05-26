"use client";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import React from "react";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";

const BookBarcode = ({ id }: { id: string }) => {
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
      <Button className="gap-x-3">
        Print <PrinterIcon size={14} />
      </Button>
    );
  }, []);

  return (
    <>
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
      <Barcode ref={componentRef} value={id} width={2} />
    </>
  );
};

export default BookBarcode;
