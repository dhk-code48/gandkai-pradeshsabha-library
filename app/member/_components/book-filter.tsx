import { Input } from "@/components/ui/input";

import React, { FC } from "react";

const BookFilter: FC<{
  handleBookNameChange: (value: string) => void;
}> = ({ handleBookNameChange }) => {
  return (
    <div className="flex items-center gap-x-3">
      <Input
        placeholder="Search Books ..."
        onChange={(e) => handleBookNameChange(e.target.value)}
      />
    </div>
  );
};

export default BookFilter;
