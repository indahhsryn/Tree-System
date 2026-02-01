import { useEffect, useState } from 'react';
import { API } from '../config/api';
import { Menu } from '../types/menu';
import { CheckCircle, Loader2, Trash2 } from 'lucide-react';

export default function MenuDetail({
  menu,
  depth,
  onSaved,
}: {
  menu: Menu | null;
  depth: number;
  onSaved: () => void;
}) {
  const isCreate = menu === null;

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [allMenus, setAllMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // =====================
  // FETCH MENU LIST
  // =====================
  useEffect(() => {
    fetch(API.menus)
      .then(res => res.json())
      .then(setAllMenus);
  }, []);

  // =====================
  // SYNC SELECTED MENU
  // =====================
  useEffect(() => {
    if (menu) {
      setTitle(menu.title);
      setUrl(menu.url ?? '');
      setParentId(menu.parent?.id ?? null);
    } else {
      setTitle('');
      setUrl('');
      setParentId(null);
    }
  }, [menu]);

  // =====================
  // SAVE (CREATE / UPDATE) — FIX FINAL
  // =====================
  const save = async () => {
    if (!title) return;
    setLoading(true);

    let payload: any;

    if (isCreate) {
      payload = {
        title,
        url,
      };

      // CREATE: kirim parentId hanya kalau ADA
      if (parentId !== null) {
        payload.parentId = parentId;
      }
    } else {
      //  UPDATE: parent_id boleh null / number
      payload = {
        title,
        url,
        parent_id: parentId,
      };
    }

    const endpoint = isCreate
      ? API.menus
      : `${API.menus}/${menu!.id}`;

    const method = isCreate ? 'POST' : 'PUT';

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSuccess(isCreate ? 'Menu created successfully' : 'Menu updated successfully');

    setTimeout(() => {
      setLoading(false);
      setSuccess('');
      onSaved();
    }, 1200);
  };

  // =====================
  // DELETE
  // =====================
  const confirmDelete = async () => {
    if (!menu) return;
    setShowDeleteConfirm(false);
    setLoading(true);

    await fetch(`${API.menus}/${menu.id}`, {
      method: 'DELETE',
    });

    setSuccess('Menu deleted successfully');

    setTimeout(() => {
      setLoading(false);
      setSuccess('');
      onSaved();
    }, 1200);
  };

  return (
    <>
      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl p-8 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
            <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
          </div>
        )}

        <h2 className="text-lg font-semibold mb-4">
          {isCreate ? 'Create Menu' : 'Edit Menu'}
        </h2>

        {!isCreate && (
          <>
            <Field label="Menu ID" value={menu!.id} />
            <Field label="Depth" value={depth} />
          </>
        )}

        <Input label="Name" value={title} set={setTitle} />
        <Input label="URL" value={url} set={setUrl} />

        {/* PARENT SELECT */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Parent</label>
          <select
            value={parentId ?? ''}
            onChange={e =>
              setParentId(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 text-sm"
          >
            <option value="">Root</option>
            {allMenus
              .filter(m => !menu || m.id !== menu.id)
              .map(m => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={save}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold"
          >
            Save
          </button>

          {!isCreate && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
            >
              <Trash2 />
            </button>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">Delete Menu</h3>
            <p className="text-sm text-gray-500 mb-6">
              This menu and all of its children will be permanently deleted.
              <br />
              Are you sure?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {success && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded-xl flex flex-col items-center gap-2">
            <CheckCircle className="text-green-500" />
            <span className="text-sm">{success}</span>
          </div>
        </div>
      )}
    </>
  );
}

/* =====================
   SMALL COMPONENTS
===================== */

const Field = ({ label, value }: any) => (
  <div className="mb-3">
    <label className="text-sm text-gray-500">{label}</label>
    <input
      disabled
      value={value}
      className="w-full bg-gray-100 px-4 py-2 rounded-lg text-sm"
    />
  </div>
);

const Input = ({ label, value, set }: any) => (
  <div className="mb-3">
    <label className="text-sm text-gray-500">{label}</label>
    <input
      value={value}
      onChange={e => set(e.target.value)}
      className="w-full border px-4 py-2 rounded-lg text-sm"
    />
  </div>
);
