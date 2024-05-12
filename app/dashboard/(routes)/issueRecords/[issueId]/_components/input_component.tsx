import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book } from "@prisma/client";
import { Minus } from "lucide-react";
import Image from "next/image";
import React from "react";

const InputCompnent = ({
  book,
  i,
  books,
  handleChange,
  handleDelete,
  bookInfo,
}: {
  books: string[];
  book: string;
  bookInfo: (Book | null)[];
  i: number;
  handleChange: (i: number, value: string) => void;
  handleDelete: (i: number) => void;
}) => {
  return (
    <div key={book + i} className="flex flex-wrap mt-5 gap-5 items-center">
      <div className="flex gap-x-5 items-center mb-2">
        <Input
          name={i.toString()}
          value={books[i]}
          placeholder="Scan Qr while focusing here"
          onChange={(e) => handleChange(i, e.target.value)}
        />
        <Button
          onClick={() => handleDelete(i)}
          size="sm"
          variant="destructive"
          type="button"
        >
          <Minus size={14} />
        </Button>
      </div>
      {bookInfo[i] && (
        <div className="flex gap-x-5">
          <Image
            src={bookInfo[i]?.imageUrl || ""}
            alt="book banner"
            width={100}
            height={300}
            className="rounded-xl"
          />
          <div className="flex gap-y-1 flex-col items-start">
            <p className="font-bold text-gray-800">
              Name : {bookInfo[i]?.name}
            </p>
            <p className="text-sm text-gray-700">
              In Stock : {bookInfo[i]?.stock}
            </p>
            <p className="text-sm text-gray-700">
              Total Copies : {bookInfo[i]?.total}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputCompnent;
