"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Button } from "./ui/button";
import { LogIn, LogOutIcon } from "lucide-react";
import { User } from "@prisma/client";
import LogoutButton from "./LogoutButton";

type Props = {
  user: User | null;
};

const NavBar = ({ user }: Props) => {
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const LogoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Slide + bounce the button in from the right
    tl.fromTo(
      buttonRef.current,
      { x: 100, opacity: 0 },
      {
        x: -100,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.7,
      },
    ).to(buttonRef.current, {
      x: 0,
      duration: 0.3,
      ease: "bounce.out",
    });
       // Then slide + bounce the logo in from the left
    tl.fromTo(
      logoRef.current,
      { x: -100, opacity: 0 },
      {
        x: 100,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.6,
      },
      "<+0.1", // start just after button
    ).to(logoRef.current, {
      x: 0,
      duration: 0.3,
      ease: "bounce.out",
    });
    gsap.fromTo(
      navRef.current,
      { scaleY: 0, transformOrigin: "top", opacity: 0 },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: "bounce.out",
      },
    );
    gsap.fromTo(
      navRef.current,
      { scaleX: 0, transformOrigin: "top", opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6 },
    );
    gsap.fromTo(
      navRef.current,
      { y: -50 },
      { y: 0, duration: 0.6, ease: "bounce.out" },
    );
  }, []);

  return (
    <header className="w-full flex justify-center mb-12">
      <div
        ref={navRef}
        className="flex justify-between bg-white border-black border-2 rounded-base mt-5 mx-8 p-3 w-[95%]"
      >
        <Link href="/">
          <div
            ref={logoRef}
            className="w-fit h-fit bg-main p-1 rounded-base border-3 border-black ml-3"
          >
            <h1 className="font-heading text-2xl">BRUTALIST</h1>
          </div>
        </Link>
        {user ? (
          <LogoutButton />
        ) : (
          <div className="flex gap-2" ref={buttonRef} >
            <Link href="/signup" >
              <Button className="font-heading text-lg">Sign Up</Button>
            </Link>

            <Link href="/login">
              <Button className="font-main  font-heading text-lg gap-2">
                Login <LogIn />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
