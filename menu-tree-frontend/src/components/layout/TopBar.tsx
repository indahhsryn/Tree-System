import { Menu } from 'lucide-react';

export default function TopBar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="h-14 bg-white border-b flex items-center px-4">
      <button
        className="md:hidden mr-3"
        onClick={onMenuClick}
      >
        <Menu />
      </button>

      <span className="text-sm text-gray-500">Menus</span>
    </header>
  );
}
