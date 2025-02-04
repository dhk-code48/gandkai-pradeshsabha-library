import MemberLibraryCard from "@/components/member-library-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Printer, X } from "lucide-react";
import React from "react";
import ReactToPrint from "react-to-print";

const MemberCardPrint = ({
  isOpen,
  close,
  user,
}: {
  isOpen: boolean;
  close: () => void;
  user: User;
}) => {
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
      <Button className="gap-x-3 fixed z-50 top-24 right-10">
        Print <Printer size={14} />
      </Button>
    );
  }, []);
  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-50 w-screen h-screen bg-white",
        isOpen ? "block" : "hidden"
      )}
    >
      <div className="fixed z-[60] top-10 right-10 flex flex-col gap-y-5">
        <Button variant="destructive" onClick={close}>
          <X />
        </Button>
      </div>
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
          <MemberLibraryCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default MemberCardPrint;
