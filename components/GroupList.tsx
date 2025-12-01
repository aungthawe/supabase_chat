"use client";

import { useUserStore } from "@/store/useStore";

export default function GroupList() {
  const groups = useUserStore((s) => s.groupChats);
  const setActiveGroup = useUserStore((s) => s.setActiveGroup);
  const ActiveGroup = useUserStore((s) => s.activeGroup);

  return (
    <div className="mb-2">
      {!groups && <h3 className="font-bold mb-3 text-purple-900">Groups</h3>}
      {groups.map((g) => (
        <button
          key={g.id}
          onClick={() => setActiveGroup(g)}
          className={`w-full text-left rounded-2xl p-2 mb-2 ${
            ActiveGroup && g.id === ActiveGroup.id
              ? "bg-purple-400 "
              : "bg-purple-200 hover:bg-purple-300"
          }`}
        >
          {" "}
          <div className="flex items-center gap-3 text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/groups2.png"}
              alt=""
              className="w-8 h-8 rounded-xl bg-center"
            />
            {g.title}
          </div>
        </button>
      ))}
    </div>
  );
}
