"use client";

import { Loader } from "@/components/Loader";
import StatusTag from "@/components/StatusTag";
import type { Ticket } from "@/types/Ticket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TicketsTable({
  initialTickets,
  labels,
  statusLabels,
  columns,
  priorityLabels,
}: {
  initialTickets: Ticket[];
  labels: { filterByStatus: string };
  statusLabels: Record<string, string>;
  columns: {
    id: string;
    customer: string;
    subject: string;
    status: string;
    priority: string;
  };
  priorityLabels: Record<string, string>;
}) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "all") {
      // restore server-provided tickets; defer to avoid synchronous setState in effect
      const restoreTimer = setTimeout(() => setTickets(initialTickets), 0);
      return () => clearTimeout(restoreTimer);
    }

    let mounted = true;
    const timer = setTimeout(() => setLoading(true), 0);

    fetch(`/api/tickets?status=${encodeURIComponent(status)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Ticket[]) => {
        if (mounted) setTickets(data);
      })
      .catch(() => {
        if (mounted) setTickets([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [status, initialTickets]);

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex justify-end">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mr-2">
            {labels.filterByStatus}
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="text-left border-b border-gray-400 px-4 py-3">
                {columns.id}
              </th>
              <th className="text-left border-b border-gray-400 px-4 py-3">
                {columns.customer}
              </th>
              <th className="text-left border-b border-gray-400 px-4 py-3">
                {columns.subject}
              </th>
              <th className="text-left border-b border-gray-400 px-4 py-3">
                {columns.status}
              </th>
              <th className="text-left border-b border-gray-400 px-4 py-3">
                {columns.priority}
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="block md:table-row border border-gray-400 md:border-none mb-4 md:mb-0 rounded-lg md:rounded-none shadow md:shadow-none hover:bg-gray-100 cursor-pointer"
                role="link"
                tabIndex={0}
                onClick={() => router.push(`tickets/${ticket.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`tickets/${ticket.id}`);
                  }
                }}
              >
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {ticket.id}
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {ticket.customerName}
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {ticket.subject}
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  <StatusTag
                    status={ticket.status}
                    statusLabels={statusLabels}
                  />
                </td>
                <td className="block border-b-none md:table-cell px-4 py-3 md:border-b border-gray-200 text-gray-700">
                  {priorityLabels?.[ticket.priority] ?? ticket.priority}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
