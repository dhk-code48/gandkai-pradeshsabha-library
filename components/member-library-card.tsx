import { User } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";

const MemberLibraryCard = ({ user }: { user: User }) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [user.image]);
  return (
    <div className="relative flex h-[12.4cm] w-[8.4cm] mb-[2.45cm] flex-col items-center space-y-5 rounded-xl border py-0">
      <div className="absolute top-[53%] -z-10">
        <Image
          alt="gandaki pradesh"
          width={100}
          height={100}
          src={"/logo.jpg"}
          className="h-[100px] w-100px] opacity-15"
        />
      </div>
      <div className="flex mx-5 gap-x-6 text-center">
        <Image
          alt="Gandaki Pradesh Sabha Logo"
          width={53}
          height={53}
          src="/logo.jpg"
          className="h-[53px] w-[53px]"
        />
        <div className="space-y-1">
          <h1 className="font-bold tracking-wider text-[#dc143c]">गण्डकी प्रदेश सभा पुस्तकालय</h1>
          <p className="text-sm font-bold text-[#2760b8]">नदीपुर, पोखरा, नेपाल</p>
        </div>
        <Image
          alt="nepal flag"
          width={43}
          height={43}
          src="/flag.webp"
          className="h-[43px] w-[40px]"
        />
      </div>
      <div className="relative">
        {/* <div className="h-[125px] w-[125px] rounded-full bg-[#2760b8]"></div> */}
        <div className="border-4 border-blue-500 rounded-full">
          <Image
            width={100}
            height={100}
            alt="User Profile"
            src={!error ? "/img/" + user.image : "/avatar.png"}
            onError={() => setError(true)}
            className="h-[107px] w-[107px] rounded-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-xl font-black tracking-wide">{user.name}</h1>
      <div className="flex w-full justify-evenly">
        <div className="space-y-1">
          <p>Email</p>
          <p>Post</p>
          <p>Phone</p>
        </div>
        <div className="space-y-1">
          <p>: {user.email}</p>
          <p>: {user.post}</p>
          <p>: {user.phone}</p>
        </div>
      </div>
      <div className="absolute bottom-5">
        <Barcode fontSize={15} value={user.id} width={1} height={30} />
      </div>
    </div>
  );
};

export default MemberLibraryCard;
