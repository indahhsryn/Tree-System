import { Menu } from '../types/menu';

export function reorderList(list: Menu[], from: number, to: number) {
  const result = [...list];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);

  return result.map((item, index) => ({
    ...item,
    order: index,
  }));
}
