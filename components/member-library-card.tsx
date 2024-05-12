import { User } from "@prisma/client";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Button } from "./ui/button";

const MemberLibraryCard = ({ user }: { user: User }) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [user.image]);
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex h-[900px] w-[548px] flex-col items-center space-y-10 rounded-xl border py-0">
        <div className="absolute top-[48%] -z-10">
          <Image
            alt="gandaki pradesh"
            width={200}
            height={200}
            src={"/gandakipradesh.png"}
            className="h-[200px] w-[200px] opacity-15"
          />
        </div>
        <div className="flex gap-x-5 text-center">
          <Image
            alt="Gandaki Pradesh Sabha Logo"
            width={63}
            height={53}
            src="/logo.jpg"
            className="h-[53px] w-[63px]"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-wider text-[#dc143c]">
              गण्डकी प्रदेश पुस्तकालय
            </h1>
            <p className="font-bold text-[#2760b8]">पोखरा, नेपाल</p>
          </div>
          <Image
            alt="nepal flag"
            width={53}
            height={53}
            src="/flag.webp"
            className="h-[52px] w-[52px]"
          />
        </div>
        <div className="relative">
          <div className="h-[225px] w-[225px] rounded-full bg-[#2760b8]"></div>
          <div className="absolute left-[9px] top-[9px]">
            <Image
              width={100}
              height={100}
              alt="User Profile"
              src={!error ? "/img/" + user.image : "/avatar.png"}
              onError={() => setError(true)}
              className="h-[207px] w-[207px] rounded-full object-cover"
            />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-wide">{user.name}</h1>
        <div className="flex w-full justify-evenly">
          <div>
            <p>Id</p>
            <p>Name</p>
            <p>Post</p>
            <p>Email</p>
            <p>Phone</p>
          </div>
          <div>
            <p>: {user.id}</p>
            <p>: {user.name}</p>
            <p>: {user.post}</p>
            <p>: {user.email}</p>
            <p>: {user.phone}</p>
          </div>
        </div>
        <div className="absolute bottom-5">
          <Barcode value={user.id} width={1} />
        </div>
      </div>
    </div>
  );
};

export default MemberLibraryCard;
