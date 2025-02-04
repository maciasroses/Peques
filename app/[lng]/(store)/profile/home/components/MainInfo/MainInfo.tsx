"use client";

import Form from "./Form";
import Image from "next/image";
import { useAuth, useModal } from "@/app/shared/hooks";
import { PencilIcon } from "@/app/shared/icons";
import { Modal } from "@/app/shared/components";
import UserPicture from "./UserPicture";

const MainInfo = ({ lng }: { lng: string }) => {
  const { user } = useAuth();
  const { isOpen, onClose, onOpen } = useModal();

  if (!user) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <UserPicture
          image={user.image as string}
          onParentClose={() => onClose()}
        />
      </Modal>
      <div className="w-full md:max-w-lg flex flex-col overflow-hidden rounded-lg dark:bg-gray-800 dark:text-gray-100 shadow-lg dark:shadow-gray-800 ">
        <div className="mb-8 bg-gray-200 dark:bg-gray-600">
          <div className="flex h-32 items-end justify-center">
            <div className="-mb-12 rounded-full bg-gray-200 p-2 dark:bg-gray-600 relative group">
              <Image
                priority
                width={80}
                height={80}
                alt="User Profile"
                src={user?.image as string}
                className="inline-block size-20 rounded-full"
              />
              <button
                onClick={onOpen}
                aria-label="Edit Profile Picture"
                className="absolute top-0 left-0 size-20 m-2 rounded-full bg-black/50 hidden group-hover:flex p-2 text-white items-center justify-center"
              >
                <PencilIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="grow p-5 text-center relative">
          <Form lng={lng} />
        </div>
      </div>
    </>
  );
};

export default MainInfo;
