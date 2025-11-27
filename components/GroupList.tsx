"use client";

import { useUserStore } from "@/store/useStore";

export default function GroupList() {
  const groups = useUserStore((s) => s.groupChats);
  const setActiveGroup = useUserStore((s) => s.setActiveGroup);

  return (
    <div>
      {!groups && <h3 className="font-bold mb-3 text-purple-900">Groups</h3>}
      {groups.map((g) => (
        <button
          key={g.id}
          onClick={() => setActiveGroup(g)}
          className="block w-full p-2 mb-2 rounded-xl bg-purple-200 hover:bg-purple-300"
        >
          {g.title}
        </button>
      ))}
    </div>
  );
}
