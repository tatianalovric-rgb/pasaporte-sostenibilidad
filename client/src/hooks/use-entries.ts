import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Entry } from "@shared/schema";
import { toMap, type EntryMap } from "@/lib/engine";
import { useAuth } from "@/lib/auth";

export interface EntryPatch {
  key: string;
  value?: string;
  status?: "pending" | "done" | "na";
  note?: string;
  evidence?: string;
  owner?: string;
}

/**
 * Persistencia con degradación elegante:
 *  - Si existe el backend Express, se usa la API (SQLite local o Supabase según credenciales).
 *  - Si no responde, la sesión continúa en memoria para no perder lo escrito.
 */
let mode: "api" | "local" | "unknown" = "unknown";

let memory: Entry[] | null = null;

function localList(): Entry[] {
  if (memory === null) memory = [];
  return memory;
}

function localUpsert(items: Required<EntryPatch>[]): Entry[] {
  const list = [...localList()];
  for (const item of items) {
    const i = list.findIndex((e) => e.key === item.key);
    const next: Entry = { id: i >= 0 ? list[i].id : list.length + 1, ...item };
    if (i >= 0) list[i] = next;
    else list.push(next);
  }
  memory = list;
  return list;
}

export function useEntries() {
  const { user, activeCompanyId, isConsultant } = useAuth();
  
  // Si la consultora ha seleccionado una empresa específica, el endpoint envía ese companyId
  const targetCompanyId = isConsultant && activeCompanyId ? activeCompanyId : undefined;
  const entriesUrl = targetCompanyId ? `/api/entries?companyId=${encodeURIComponent(targetCompanyId)}` : "/api/entries";
  const queryKey = ["/api/entries", targetCompanyId || "default"];

  const query = useQuery<Entry[]>({
    queryKey,
    queryFn: async () => {
      if (mode === "local") return localList();
      try {
        const res = await apiRequest("GET", entriesUrl);
        const data = (await res.json()) as Entry[];
        mode = "api";
        return data;
      } catch {
        mode = "local";
        return localList();
      }
    },
  });

  const map: EntryMap = toMap(query.data);

  const save = useMutation({
    mutationFn: async (patches: EntryPatch[]) => {
      const items = patches.map((p) => {
        const current = map[p.key];
        return {
          key: p.key,
          value: p.value ?? current?.value ?? "",
          status: p.status ?? current?.status ?? "pending",
          note: p.note ?? current?.note ?? "",
          evidence: p.evidence ?? current?.evidence ?? "",
          owner: p.owner ?? current?.owner ?? "",
        };
      });
      if (mode === "api") {
        try {
          const res = await apiRequest("PUT", entriesUrl, { items });
          return (await res.json()) as Entry[];
        } catch {
          mode = "local";
        }
      }
      return localUpsert(items as Required<EntryPatch>[]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      queryClient.setQueryData(["/api/entries"], data);
    },
  });

  const reset = useMutation({
    mutationFn: async () => {
      if (mode === "api") {
        try {
          await apiRequest("DELETE", entriesUrl);
          return [] as Entry[];
        } catch {
          mode = "local";
        }
      }
      memory = [];
      return [] as Entry[];
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKey, []);
      queryClient.setQueryData(["/api/entries"], []);
    },
  });

  return { entries: query.data ?? [], map, isLoading: query.isLoading, save, reset };
}
