"use client";

import Edit from "./Edit";
import Delete from "./Delete";
import { ElipsisList } from "@/app/shared/icons";
import { useEffect, useRef, useState } from "react";

interface IActions {
  lng: string;
  customList: {
    id: string;
    name: string;
    description: string | null;
  };
}

const Actions = ({ lng, customList }: IActions) => {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !(menuRef.current as HTMLElement).contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block pt-4 pr-4" ref={menuRef}>
      <button onClick={handleModal} aria-label="Actions">
        <ElipsisList />
      </button>
      {isOpen && (
        <div className="w-20 origin-top-right absolute right-4 top-10 rounded-md shadow-lg bg-gray-50 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Edit lng={lng} customList={customList} handleClose={handleModal} />
          <Delete lng={lng} customList={customList} handleClose={handleModal} />
        </div>
      )}
    </div>
  );
};

export default Actions;
