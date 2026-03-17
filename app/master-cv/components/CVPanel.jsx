"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { categoryConfig, formatDuration } from "../data";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Command,
} from "lucide-react";


const columnHelper = createColumnHelper();

function CategoryBadge({ category }) {
  const config = categoryConfig[category];
  if (!config) return <span className="text-xs text-gray-500">{category}</span>;

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark") || document.body.classList.contains("dark"));
  }, []);

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap"
      style={{
        color: config.color,
        backgroundColor: isDark ? config.bgDark : config.bgLight,
      }}
    >
      {config.label}
    </span>
  );
}

function SkillChip({ skill }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 whitespace-nowrap">
      {skill}
    </span>
  );
}

function SortIcon({ column }) {
  const sorted = column.getIsSorted();
  if (!sorted) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
  if (sorted === "asc") return <ArrowUp className="w-3 h-3 text-gray-600 dark:text-gray-300" />;
  return <ArrowDown className="w-3 h-3 text-gray-600 dark:text-gray-300" />;
}

const columns = [
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => <CategoryBadge category={info.getValue()} />,
    size: 140,
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: (info) => (
      <span className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:underline decoration-1 underline-offset-2">
        {info.getValue()}
      </span>
    ),
    size: 250,
  }),
  columnHelper.accessor("organization", {
    header: "Organization",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">{info.getValue()}</span>
    ),
    size: 160,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => (
      <span className="text-gray-600 dark:text-gray-400">{info.getValue()}</span>
    ),
    size: 160,
  }),
  columnHelper.accessor("duration", {
    header: "Duration",
    cell: (info) => (
      <span className="text-gray-500 dark:text-gray-500 text-xs whitespace-nowrap">
        {formatDuration(info.getValue())}
      </span>
    ),
    size: 170,
    sortingFn: (a, b) => {
      const dateA = new Date(a.original.duration?.start || 0);
      const dateB = new Date(b.original.duration?.start || 0);
      return dateA - dateB;
    },
  }),
  columnHelper.accessor("skills_tools", {
    header: "Skills",
    cell: (info) => {
      const skills = info.getValue() || [];
      const visible = skills.slice(0, 3);
      const remaining = skills.length - 3;
      return (
        <div className="flex items-center gap-1 flex-wrap">
          {visible.map((s) => (
            <SkillChip key={s} skill={s} />
          ))}
          {remaining > 0 && (
            <span className="text-[10px] text-gray-400">+{remaining}</span>
          )}
        </div>
      );
    },
    size: 200,
    enableSorting: false,
  }),
  columnHelper.accessor("impact_rating", {
    header: "Impact",
    cell: (info) => {
      const rating = info.getValue();
      return (
        <div className="flex items-center gap-1">
          <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${rating * 10}%`,
                backgroundColor: rating >= 8 ? "#22c55e" : rating >= 6 ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>
          <span className="text-[10px] text-gray-500 tabular-nums">{rating}/10</span>
        </div>
      );
    },
    size: 110,
  }),
];

export default function CVPanel({ data, onSelectEntry }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilterBar, setShowFilterBar] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const searchRef = useRef(null);
  const panelRef = useRef(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowCategoryDropdown(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter data by category
  const filteredData = useMemo(() => {
    if (categoryFilter === "all") return data;
    return data.filter((d) => d.category === categoryFilter);
  }, [data, categoryFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div
      ref={panelRef}
      className="relative h-full flex flex-col bg-[#FAFAFA] dark:bg-[#0c0a0a] overflow-hidden"
    >
      {/* ─── Table Container ─── */}
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        <table className="w-full border-collapse min-w-[900px]">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-[#F5F0EB] dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                      header.column.getCanSort() ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200" : ""
                    }`}
                    style={{ width: header.column.getSize() }}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <SortIcon column={header.column} />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                onClick={() => onSelectEntry(row.original)}
                className="border-b border-gray-100 dark:border-gray-800/50 cursor-pointer transition-colors hover:bg-white dark:hover:bg-[#161211] group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="w-8 h-8 mb-3 opacity-50" />
            <p className="text-sm">No entries found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Bottom padding for filter bar */}
        <div className="h-20" />
      </div>

      {/* ─── Floating Filter Bar (Notion-style) ─── */}
      <AnimatePresence>
        {showFilterBar && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-4 left-4 right-4 z-20"
          >
            {/* Gradient fade above the bar */}
            <div className="absolute -top-12 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t from-[#FAFAFA] dark:from-[#0c0a0a] to-transparent" />

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200/80 dark:border-gray-700/50 bg-white/80 dark:bg-[#161211]/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20">
              {/* Search */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none min-w-0"
                />
                {globalFilter && (
                  <button onClick={() => setGlobalFilter("")} className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
                {/* Keyboard hint */}
                <div className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-400 flex-shrink-0">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span className="hidden sm:inline">
                    {categoryFilter === "all" ? "All Categories" : categoryConfig[categoryFilter]?.label}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 right-0 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] shadow-xl py-1 z-30"
                    >
                      <button
                        onClick={() => { setCategoryFilter("all"); setShowCategoryDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                          categoryFilter === "all"
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        All Categories
                      </button>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => { setCategoryFilter(key); setShowCategoryDropdown(false); }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                            categoryFilter === key
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          {config.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
