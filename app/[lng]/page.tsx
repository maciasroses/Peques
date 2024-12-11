import Image from "next/image";
import Logo from "@/public/assets/images/logo-color.webp";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-center justify-center px-4 pt-20">
      <Image
        className="w-full max-w-[300px] h-auto"
        src={Logo}
        alt="Peques logo"
        priority
      />
      <h1 className="text-3xl">Próximamente...</h1>
    </div>
  );
}
