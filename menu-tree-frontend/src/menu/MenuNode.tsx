import { Menu } from '../types/menu';

interface Props {
  menu: Menu;
  depth: number;
  expandAll: boolean;
  onSelect: (menu: Menu, depth: number) => void;
  onDragStart: (menu: Menu) => void;
  onDrop: (menu: Menu) => void;
}

export default function MenuNode({
  menu,
  depth,
  expandAll,
  onSelect,
  onDragStart,
  onDrop,
}: Props) {
  return (
    <div className="relative">
      {/* NODE */}
      <div
        draggable
        onDragStart={e => {
          e.stopPropagation();
          onDragStart(menu);
        }}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          onDrop(menu);
        }}
        onClick={e => {
          e.stopPropagation();
          onSelect(menu, depth);
        }}
        style={{ paddingLeft: depth * 20 }}
        className="relative flex items-center gap-2 py-1 cursor-pointer hover:text-blue-600"
      >
        {/* GARIS VERTIKAL */}
        {depth > 0 && (
          <span
            className="absolute top-0 bottom-0 w-px bg-slate-300"
            style={{ left: depth * 20 - 10 }}
          />
        )}

        {/* GARIS HORIZONTAL */}
        {depth > 0 && (
          <span
            className="absolute top-1/2 h-px bg-slate-300 w-4"
            style={{ left: depth * 20 - 10 }}
          />
        )}

        {/* DOT */}
        <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />

        <span className="text-sm">{menu.title}</span>
      </div>

      {/* CHILDREN */}
      {menu.children?.map(child => (
        <MenuNode
          key={child.id}
          menu={child}
          depth={depth + 1}
          expandAll={expandAll}
          onSelect={onSelect}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}
