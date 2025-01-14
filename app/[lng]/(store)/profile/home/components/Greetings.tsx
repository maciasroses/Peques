"use client";

import { useAuth } from "@/app/shared/hooks";

const Greetings = () => {
  const { user } = useAuth();

  return (
    <h1 className="text-4xl">
      Hola,{" "}
      {user?.firstName || user?.lastName
        ? `${user?.firstName} ${user?.lastName}`
        : user?.username}
    </h1>
  );
};

export default Greetings;
