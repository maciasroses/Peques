"use client";

import { useAuth } from "@/app/shared/hooks";
import { getGreeting } from "@/app/shared/utils/greetings";

const Greetings = () => {
  const { user } = useAuth();

  return (
    <h1 className="text-4xl">
      Hola,{" "}
      {user?.firstName || user?.lastName
        ? `${user?.firstName} ${user?.lastName}`
        : user?.username}
      {", "}
      {getGreeting()}
    </h1>
  );
};

export default Greetings;
