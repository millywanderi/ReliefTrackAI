export interface NavigationItem {
  label: string;
  path: string;
  roles: number[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [1, 2, 3],
  },
  {
    label: "Beneficiaries",
    path: "/beneficiaries",
    roles: [1, 2, 3],
  },
  {
    label: "Warehouses",
    path: "/warehouses",
    roles: [1, 2, 3],
  },
  {
    label: "Inventory",
    path: "/inventory",
    roles: [1, 2, 3],
  },
  {
    label: "Distribution",
    path: "/distribution",
    roles: [1, 2, 3],
  },
  {
    label: "Analytics",
    path: "/analytics",
    roles: [1, 2],
  },
  {
    label: "AI Reports",
    path: "/ai",
    roles: [1, 2],
  },
  {
    label: "Administration",
    path: "/administration",
    roles: [1],
  },
];
