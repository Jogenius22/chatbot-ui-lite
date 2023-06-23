import { IconDots } from "@tabler/icons-react";
import { FC } from "react";

interface Props {}

export const ChatLoader: FC<Props> = () => {
  return (
    <div className="flex flex-col flex-start">
      <div
        className="flex items-center bg-[#f9c200] text-neutral-900 rounded-2xl px-4 py-2 w-fit animate-pulse"
        style={{ overflowWrap: "anywhere" }}
      >
        <IconDots className="animate-pulse" />
      </div>
    </div>
  );
};
