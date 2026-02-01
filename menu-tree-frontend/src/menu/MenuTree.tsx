import { useEffect, useState } from 'react';
import { API } from '../config/api';
import { Menu } from '../types/menu';
import MenuNode from './MenuNode';

interface Props {
  onSelect: (menu: Menu, depth: number) => void;
  reloadKey: number;
}

export default function MenuTree({ onSelect, reloadKey }: Props) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [rootId, setRootId] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(true);
  const [dragging, setDragging] = useState<Menu | null>(null);

  const fetchMenus = async () => {
    const res = await fetch(API.menus);
    const data: Menu[] = await res.json();
    setMenus(data);
    if (!rootId && data.length) setRootId(data[0].id);
  };

  useEffect(() => {
    fetchMenus();
  }, [reloadKey]);

  const roots = menus.filter(m => m.parent === null);
  const selectedRoot = roots.find(r => r.id === rootId);

  // =========================
  // DROP HANDLER (ROOT / NODE)
  // =========================
  const handleDrop = async (target: Menu | null) => {
    if (!dragging) return;

    await fetch(`${API.menus}/${dragging.id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newParentId: target ? target.id : null,
      }),
    });

    setDragging(null);
    fetchMenus();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm relative">
      <label className="text-sm text-gray-500">Menu</label>

      {/* ROOT SELECT */}
      <select
        value={rootId ?? ''}
        onChange={e => setRootId(Number(e.target.value))}
        className="w-full mt-1 mb-4 px-4 py-2 rounded-lg bg-gray-100 text-sm"
      >
        {roots.map(r => (
          <option key={r.id} value={r.id}>
            {r.title}
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

      {/*INVISIBLE ROOT DROP ZONE (JANGAN DIHAPUS) */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={() => handleDrop(null)}
        className="absolute inset-0 z-0"
      />

      {/* TREE */}
      <div className="relative z-10 space-y-1">
        {/* EXPAND ALL */}
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

        {/* COLLAPSE ALL */}
        {!expandAll && selectedRoot && (
          <MenuNode
            menu={selectedRoot}
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
