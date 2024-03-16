import { StorageManager } from "@/lib/storage-manager";
import { Song } from "@/music/data";
import { FormEventHandler, useState } from "react";
import { cva } from "cva";
import { cn } from "@/lib/cn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MusicManager } from "@/lib/music-manager";
import { buttonVariants } from "@/components/ui/button";

const inputVariants = cva(
  "bg-transparent rounded-lg bg-purple-200/10 text-sm px-2 py-1 -mx-2 placeholder:text-purple-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
);

export function CreateCustomSongDialog({
  musicManager,
}: {
  musicManager: MusicManager;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({
            className: "flex-1",
            variant: "secondary",
          }),
        )}
      >
        Custom Songs
      </DialogTrigger>
      <DialogContent>
        <CreateCustomSong
          storage={musicManager.storageManager}
          onClose={() => {
            // reload
            musicManager.queueManager.setSongs(
              musicManager.storageManager.loadSongs(),
            );
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateCustomSong({
  storage,
  onClose,
}: {
  storage: StorageManager;
  onClose: () => void;
}) {
  return (
    <div>
      <h2 className="font-medium">Add Custom Song</h2>
      <p className="text-purple-200 text-sm mb-6">
        Bring your own songs to here
      </p>
      <NewSong
        onAdd={(song) => {
          const update = [...storage.getCustomSongs(), song];

          storage.saveCustomSongs(update);
          onClose();
        }}
      />
    </div>
  );
}

function NewSong({ onAdd }: { onAdd: (song: Song) => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (name.trim().length === 0 || url.trim().length === 0) return;
    onAdd({
      name,
      url,
      author: "User",
      isCustom: true,
    });
  };

  return (
    <form className="flex flex-col gap-6 *:flex *:flex-col" onSubmit={onSubmit}>
      <fieldset>
        <label htmlFor="name" className="text-xs font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name of song"
          className={cn(inputVariants())}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="url" className="text-xs font-medium mb-1">
          URL
        </label>
        <input
          id="url"
          value={url}
          type="url"
          placeholder="Song URL"
          onChange={(e) => setUrl(e.target.value)}
          className={cn(inputVariants())}
        />
      </fieldset>
      <button
        className={cn(
          buttonVariants({ variant: "primary", className: "w-fit" }),
        )}
      >
        Submit
      </button>
    </form>
  );
}
