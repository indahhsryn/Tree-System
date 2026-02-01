import { useEffect, useState } from 'react';
import { API } from '../config/api';
import { Menu } from '../types/menu';
import MenuNode from './MenuNode';
import { XCircle } from 'lucide-react';

interface Props {
  onSelect: (menu: Menu, depth: number) => void;
  reloadKey: number;
}

export default function MenuTree({ onSelect, reloadKey }: Props) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(true);
  const [dragging, setDragging] = useState<Menu | null>(null);
  const [error, setError] = useState('');

  const fetchMenus = async () => {
    const res = await fetch(API.menus);
    const data: Menu[] = await res.json();
    setMenus(data);
    if (!selectedId && data.length) setSelectedId(data[0].id);
  };

  useEffect(() => {
    fetchMenus();
  }, [reloadKey]);

  const roots = menus.filter(m => m.parent === null);
  const selectedMenu = menus.find(m => m.id === selectedId) || null;

  // =========================
  // DROP HANDLER
  // =========================
  const handleDrop = async (target: Menu | null) => {
    if (!dragging) return;
    setError('');

    try {
      const res = await fetch(
        `${API.menus}/${dragging.id}/move`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newParentId: target ? target.id : null,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      setDragging(null);
      fetchMenus();
    } catch (e: any) {
      setError(e.message);
      setDragging(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm relative">
      <label className="text-sm text-gray-500">Menu</label>

      {/* ERROR */}
      {error && (
        <div className="mb-3 flex items-center gap-2 text-sm text-red-700 bg-red-50 px-4 py-2 rounded-lg">
          <XCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <select
        value={selectedId ?? ''}
        onChange={e => setSelectedId(Number(e.target.value))}
        className="w-full mt-1 mb-4 px-4 py-2 rounded-lg bg-gray-100 text-sm"
      >
        {menus.map(m => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>

      {/* ACTION */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setExpandAll(true)}
          className={`px-5 py-2 rounded-full text-sm ${
            expandAll ? 'bg-slate-900 text-white' : 'bg-gray-100'
          }`}
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandAll(false)}
          className={`px-5 py-2 rounded-full text-sm ${
            !expandAll ? 'bg-slate-900 text-white' : 'bg-gray-100'
          }`}
        >
          Collapse All
        </button>
      </div>

      <div
  onDragOver={e => dragging && e.preventDefault()}
  onDrop={() => dragging && handleDrop(null)}
  className={`absolute inset-0 z-0 ${
    dragging ? 'pointer-events-auto' : 'pointer-events-none'
  }`}
/>


      {/* TREE */}
      <div className="relative z-10 space-y-1">
        {/* EXPAND ALL → SEMUA ROOT */}
        {expandAll &&
          roots.map(root => (
            <MenuNode
              key={root.id}
              menu={root}
              depth={0}
              expandAll
              onSelect={onSelect}
              onDragStart={setDragging}
              onDrop={handleDrop}
            />
          ))}

        {!expandAll && selectedMenu && (
          <MenuNode
            menu={selectedMenu}
            depth={0}
            expandAll={false}
            onSelect={onSelect}
            onDragStart={setDragging}
            onDrop={handleDrop}
          />
        )}
      </div>
    </div>
  );
}
