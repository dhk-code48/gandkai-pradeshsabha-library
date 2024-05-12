"use client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function AuthenticationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container h-screen flex items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden lg:flex h-full flex-col bg-muted p-10 text-white">
        <div className="z-10 absolute inset-0 bg-zinc-900/50" />
        <Image
          src="/library.jpg"
          width={1400}
          height={600}
          alt="Library"
          className="z-0 absolute top-0 left-0 h-screen object-cover"
        />
        <div className="z-20 flex items-center gap-2">
          <Image
            src="/gandakipradesh.png"
            alt="Gandaki Pradesh Library"
            width={512}
            height={512}
            className="w-20 bg-blend-color-doge"
          />
          <div className="text-white">
            <h1 className="text-lg font-extrabold">Pradesh Library</h1>
            <h4 className="font-bold flex items-center gap-x-5">
              <Phone size={16} />
              ०६१-४६७८७३
            </h4>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            {/* <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and helped me deliver
              stunning designs to my clients faster than ever before.&rdquo;
            </p> */}
            <footer className="text-sm">Gandaki Pradesh</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}
