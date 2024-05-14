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
    <div className="relative flex h-[21cm] w-[14.8cm] flex-col items-center space-y-10 rounded-xl border py-0">
      <div className="absolute top-[53%] -z-10">
        <Image
          alt="gandaki pradesh"
          width={200}
          height={200}
          src={"/logo.jpg"}
          className="h-[200px] w-[200px] opacity-15"
        />
      </div>
      <div className="flex mx-5 gap-x-6 text-center">
        <Image
          alt="Gandaki Pradesh Sabha Logo"
          width={63}
          height={53}
          src="/logo.jpg"
          className="h-[103] w-[103px]"
        />
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-wider text-[#dc143c]">
            गण्डकी प्रदेश सभा पुस्तकालय
          </h1>
          <p className="font-bold text-[#2760b8]">नदीपुर, पोखरा, नेपाल</p>
        </div>
        <Image
          alt="nepal flag"
          width={53}
          height={53}
          src="/flag.webp"
          className="h-[83px] w-[80px]"
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
        <div className="space-y-1">
          <p>Email</p>
          <p>Name</p>
          <p>Post</p>
          <p>Phone</p>
        </div>
        <div className="space-y-1">
          <p>: {user.email}</p>
          <p>: {user.name}</p>
          <p>: {user.post}</p>
          <p>: {user.phone}</p>
        </div>
      </div>
      <div className="absolute bottom-5">
        <Barcode value={user.id} width={1} />
      </div>
    </div>
  );
};

export default MemberLibraryCard;
