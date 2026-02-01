import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/TopBar';
import MenuTree from '../menu/MenuTree';
import MenuDetail from '../menu/MenuDetail';
import { Menu } from '../types/menu';

export default function MenuPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [depth, setDepth] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="text-sm text-gray-400 mb-4">/ Menus</div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold">Menus</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT */}
            <MenuTree
              reloadKey={reloadKey}
              onSelect={(menu, d) => {
                setSelectedMenu(menu);
                setDepth(d);
              }}
            />

            {/* RIGHT */}
            <MenuDetail
              menu={selectedMenu}
              depth={depth}
              onSaved={() => {
                setSelectedMenu(null);
                setDepth(0);
                setReloadKey(v => v + 1);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
