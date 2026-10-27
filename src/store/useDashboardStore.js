import { create } from "zustand";
import { persist } from "zustand/middleware";
import seed from "../data/dashboard.json";

export const TIME_RANGES = [
  { id: "2d", label: "Last 2 days" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

const defaultCategories = () => structuredClone(seed.categories);

export const useDashboardStore = create(
  persist(
    (set) => ({
      categories: defaultCategories(),
      search: "",
      timeRange: "2d",
      drawerOpen: false,
      drawerCategoryId: "cspm",
      drawerNonce: 0,

      setSearch: (search) => set({ search }),
      setTimeRange: (timeRange) => set({ timeRange }),

      openDrawer: (categoryId) =>
        set((state) => ({
          drawerOpen: true,
          drawerCategoryId: categoryId || state.categories[0]?.id || "cspm",
          drawerNonce: state.drawerNonce + 1,
        })),

      closeDrawer: () => set({ drawerOpen: false }),

      setCategories: (categories) => set({ categories }),

      hideWidget: (categoryId, widgetId) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id !== categoryId
              ? category
              : {
                  ...category,
                  widgets: category.widgets.map((widget) =>
                    widget.id === widgetId ? { ...widget, visible: false } : widget,
                  ),
                },
          ),
        })),

      reset: () =>
        set({
          categories: defaultCategories(),
          search: "",
          timeRange: "2d",
          drawerOpen: false,
        }),
    }),
    {
      name: "cnapp-dashboard",
      partialize: (state) => ({
        categories: state.categories,
        timeRange: state.timeRange,
      }),
    },
  ),
);
