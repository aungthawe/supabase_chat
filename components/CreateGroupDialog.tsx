"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createGroup } from "@/lib/group"; // your backend
import { Profile } from "@/types/db";
import { Plus } from "lucide-react";
import { useUserStore } from "@/store/useStore";

export default function CreateGroupDialog() {
  const currentUser = useUserStore((s) => s.currentUser);
  const [open, setOpen] = useState(false);
  const profiles = useUserStore((s) => s.profiles);
  //const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile[]>([]);
  const [title, setTitle] = useState("");

  // useEffect(() => {
  //   fetchProfiles().then((p) => setProfiles(p || []));
  // }, []);

  // function toggleSelect(id: string) {
  //   setSelected((prev) =>
  //     prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  //   );
  // }

  function toggleSelect(profile: Profile) {
    setSelected((prev) =>
      prev.some((p) => p.id === profile.id)
        ? prev.filter((x) => x.id !== profile.id)
        : [...prev, profile]
    );
  }

  async function handleCreate() {
    if (!title.trim() || selected.length < 2) {
      alert("Pick a title & at least 2 members");
      return;
    }

    if (!currentUser) return;
    await createGroup(title, currentUser?.id, selected);
    setOpen(false);
    setSelected([]);
    setTitle("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="rounded-full p-3 bg-purple-600 text-white hover:bg-purple-700">
          <Plus size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md  text-purple-800 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Create Group Chat
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Group Title Input */}
          <input
            className="w-full p-2 rounded-xl border"
            placeholder="Enter group title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Selected Users */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selected.map((profile) => (
                <span
                  key={profile.id}
                  className="text-sm bg-purple-200 px-2 py-1 rounded-lg"
                >
                  {profile.username || profile.id.slice(0, 6)}
                </span>
              ))}
            </div>
          )}

          {/* User List */}
          <div className="max-h-60 overflow-y-auto border rounded-xl p-3">
            {profiles.map((p) => (
              <button
                key={p.id}
                className={`w-full flex items-center gap-3 p-2 rounded-xl mb-2 ${
                  selected.some((profile) => profile.id === p.id)
                    ? "bg-purple-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => toggleSelect(p)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img
                  src={p.avatar_url || "/user.png"}
                  className="w-10 h-10 rounded-full"
                />
                <span>{p.username || p.id.slice(0, 8)}</span>
              </button>
            ))}
          </div>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
            onClick={handleCreate}
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
