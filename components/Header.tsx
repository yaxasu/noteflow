"use client";

import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";


import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import usePlayer from "@/hooks/usePlayer"

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const player = usePlayer()

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    // Reset any playing songs
    player.reset()
    router.push('/')
    router.refresh();
    

    if (error) {
      toast.error(error.message)
    } else{
      toast.success('Logged out!')
    }
  };

  return (
    <div
      className={twMerge(
        `
            h-fit
            bg-gradient-to-b
            from-emerald-800
            via-emerald-600
            to-teal-400
            p-6

        `,
        className
      )}
    >
      <div
        className="
            w-full
            mb-4
            flex
            items-center
            justify-between
        "
      >
        <div
          className="
                hidden
                md:flex
                gap-x-2
                items-center
            "
        >
          <button
            onClick={() => router.back()}
            className="
                    rounded-full
                    bg-black
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                "
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => router.forward()}
            className="
                    rounded-full
                    bg-black
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                "
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div
          className="
            flex
            md:hidden
            gap-x-2
            items-center
        "
        >
          <button
            onClick={() => router.push('/')}
            className="
            rounded-full
            p-2
            bg-white
            flex
            justify-center
            items-center
            hover:opacity-75
            transition
          "
          >
            <HiHome className="text-black size={20}" />
          </button>
          <button
            onClick={() => router.push('/search')}
            className="
            rounded-full
            p-2
            bg-white
            flex
            justify-center
            items-center
            hover:opacity-75
            transition
          "
          >
            <BiSearch className="text-black size={20}" />
          </button>
        </div>
        <div
          className="
            flex
            justify-between
            items-center
            gap-x-4
          "
        >
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button
                onClick={handleLogout}
                className="bg-white px-6 py-2"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="
                  bg-transparent
                  text-neutral-300
                  font-medium
                "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="
                  bg-white
                  px-6
                  py-2
                "
                >
                  Login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
