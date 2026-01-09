import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}


export default function Home() {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [updateId, setUpdateId] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("CREATED");


  // 🔹 Fetch notes
  const fetchNotes = async () => {
    const data = await apiFetch("/api/note/getall", {
      method: "GET",
      credentials: "include",
    });

    const sorted = data.note.sort(
      (a: Note, b: Note) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    setNotes(sorted);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 🔹 Validation schema
  const schema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // const form = e.currentTarget;

    const formData: { title: string; description: string } = {
      title,
      description
    };

    try {
      await schema.validate(formData, { abortEarly: false });


      const response = await apiFetch(`/api/note/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });
      console.log("response-", response);
      const { success } = response;

      if (!success) {
        throw new Error("Create Note failed");
      }
      fetchNotes();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const messages = err.inner.map((e: any) => e.message);
        toast(messages.join("\n"));
      } else {
        toast("Something went wrong");
        console.error(err);
      }
    } finally {
      setLoading(false);
      setTitle("");
      setDescription("")
    }
  };
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const form = e.currentTarget;

    try {
      const response = await apiFetch(`/api/note/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ id: updateId, title: updateTitle, description: updateDescription }),
      });
      console.log("response-", response);
      const { success } = response;

      if (!success) {
        throw new Error("Update Note failed");
      }
      fetchNotes();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const messages = err.inner.map((e: any) => e.message);
        toast(messages.join("\n"));
      } else {
        toast("Something went wrong");
        console.error(err);
      }
    } finally {
      setUpdateId("")
      setUpdateTitle("")
      setUpdateDescription("")
    }
  };

  const handleDeleteNotes = async (id: string) => {

    // const form = e.currentTarget;
    try {
      const response = await apiFetch(`/api/note/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response-", response);
      const { success } = response;

      if (!success) {
        throw new Error("Create Note failed");
      }
      fetchNotes();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const messages = err.inner.map((e: any) => e.message);
        toast(messages.join("\n"));
      } else {
        toast("Something went wrong");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sort === "CREATED") {
      setNotes((e: Note[]) => {
        e.sort((a: Note, b: Note) => {
          return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        })
        return [...e]
      })
    }

    else if (sort === "TITLE") {
      setNotes((e: Note[]) => {
        e.sort((a: Note, b: Note) => {
          return a.title.localeCompare(b.title);
        });

        return [...e]
      })
    }
    
  }, [sort])
  useEffect(() => {
    console.log(notes)
  }, [notes])
  



  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">Note Manager</h1>
        <p className="mt-4 text-gray-400">
          Create notes and manage them efficiently
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto mt-12 max-w-xl space-y-3">
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full rounded-md bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Note description"
            rows={3}
            className="w-full rounded-md bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-500 px-4 py-2 font-semibold hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </div>
      </form>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <form onSubmit={handleUpdateSubmit}>
                <div className="bg-gray-800 px-2 pt-2 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto mt-1 max-w-xl space-y-3">
                      <div className="flex flex-row justify-end ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 inline text-red-500 cursor-pointer" onClick={() => {
                          setOpen(false);
                          setUpdateId("")
                          setUpdateTitle("")
                          setUpdateDescription("")
                        }}>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <label htmlFor="title" className="text-white">Title: </label>
                      <input
                        name="title"
                        value={updateTitle}
                        onChange={(e) => setUpdateTitle(e.target.value)}
                        placeholder="Note title"
                        className="w-full rounded-md bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white"
                      />
                      <label htmlFor="description" className="text-white">Description: </label>
                      <textarea
                        name="description"
                        value={updateDescription}
                        onChange={(e) => setUpdateDescription(e.target.value)}
                        placeholder="Note description"
                        rows={3}
                        className="w-full rounded-md bg-gray-800 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 border border-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    data-autofocus
                    onClick={() => {
                      setOpen(false);
                    }
                    }
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                  >
                    Update
                  </button>

                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog >

      <div className="mx-auto mt-10 max-w-xl">
        <div className="flex flex-row justify-between">
          <h2 className="mb-4 text-lg font-semibold">
            All Notes
          </h2>
          <div>
            <Menu as="div" className="relative inline-block">
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                Sort By
                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <p
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                      onClick={() => setSort("TITLE")}
                    >
                      Title
                    </p>
                  </MenuItem>
                  <MenuItem>
                    <p
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                      onClick={() => setSort("CREATED")}
                    >
                      Created At
                    </p>
                  </MenuItem>


                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
        {
          notes.length === 0 ? (
            <p className="text-gray-400">No notes yet.</p>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-md bg-gray-800 px-4 py-3"
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{note.title}</h3>
                    <div className="">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 inline mr-3 cursor-pointer" onClick={
                        () => {
                          setOpen(true);
                          setUpdateId(note.id)
                          setUpdateTitle(note.title)
                          setUpdateDescription(note.description)

                        }}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 inline text-red-500 cursor-pointer" onClick={() => { handleDeleteNotes(note.id) }}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </div>

                  </div>

                  {note.description && (
                    <p className="mt-2 text-sm text-gray-300">
                      {note.description}
                    </p>
                  )}
                  <div className="flex flex-row  justify-end">
                    <span className="text-sm text-gray-400">
                      Created By: {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </div >
    </div >
  );
}
