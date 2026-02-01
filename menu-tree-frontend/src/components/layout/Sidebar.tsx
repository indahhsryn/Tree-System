import {
  Folder,
  Grid,
  LayoutGrid,
  Code2,
  Users,
  Trophy,
  Menu as MenuIcon,
  LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-40
          h-full w-64
          bg-gradient-to-b from-blue-700 to-blue-600
          text-white
          rounded-r-3xl
          p-5
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-sm leading-tight">
              Solusi <br /> Teknologi Kreatif
            </span>
          </div>

          <MenuIcon className="w-5 h-5 md:hidden" />
        </div>

        {/* Menu */}
        <nav className="space-y-2 text-sm">
          <MenuItem icon={Folder} label="Systems" />
          <MenuItem icon={Code2} label="System Code" />
          <MenuItem icon={LayoutGrid} label="Properties" />

          <MenuItem icon={LayoutGrid} label="Menus" active />

          <MenuItem icon={LayoutGrid} label="API List" />
          <MenuItem icon={Folder} label="Users & Group" />
          <MenuItem icon={Folder} label="Competition" />
        </nav>
      </aside>
    </>
  );
}

/* ===========================
   Menu Item Component
=========================== */
function MenuItem({
  label,
  icon: Icon,
  active,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer
        transition-all
        ${
          active
            ? 'bg-white text-gray-900 font-semibold'
            : 'text-white/90 hover:bg-blue-500/40'
        }
      `}
    >
      <Icon
        className={`w-4 h-4 ${
          active ? 'text-gray-900' : 'text-white'
        }`}
      />
      {label}
    </div>
  );
}
