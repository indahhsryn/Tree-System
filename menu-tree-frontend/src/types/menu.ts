export interface Menu {
  id: number;
  title: string;
  url: string;
  order: number;
  parent: Menu | null;
  children: Menu[];
}
