import Image from "next/image";
import React, { FC, useEffect, useState } from "react";

const BookImage: FC<{ url?: string }> = ({ url }) => {
  return <Image src={"/book.png"} alt="Book Banner" width={50} height={50} />;
};

export default BookImage;
