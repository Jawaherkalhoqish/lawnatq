import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

/** Family data hooks. RLS scopes every query to the signed-in parent. */
export function useChildren({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["children"],
    enabled,
    queryFn: async () => {
      const page = await base44.entities.Child.list({ sort: "created_date", limit: 24 });
      return page.items ?? [];
    },
  });
}

export function useCustomCards(childId) {
  return useQuery({
    queryKey: ["custom-cards", childId],
    enabled: Boolean(childId),
    queryFn: async () => {
      const page = await base44.entities.CustomCard.filter({ child_id: childId }, { sort: "-created_date", limit: 40 });
      return page.items ?? [];
    },
  });
}

export function useChild(childId) {
  return useQuery({
    queryKey: ["child", childId],
    enabled: Boolean(childId),
    queryFn: () => base44.entities.Child.get(childId),
  });
}

export function useDrawings(childId, limit = 12) {
  return useQuery({
    queryKey: ["drawings", childId, limit],
    enabled: Boolean(childId),
    queryFn: async () => {
      const page = await base44.entities.Drawing.filter({ child_id: childId }, { sort: "-created_date", limit });
      return page.items ?? [];
    },
  });
}

export function useCardSequences(childId, limit = 12) {
  return useQuery({
    queryKey: ["card-sequences", childId, limit],
    enabled: Boolean(childId),
    queryFn: async () => {
      const page = await base44.entities.CardSequence.filter({ child_id: childId }, { sort: "-created_date", limit });
      return page.items ?? [];
    },
  });
}

export function useStoryProgress(childId) {
  return useQuery({
    queryKey: ["story-progress", childId],
    enabled: Boolean(childId),
    queryFn: async () => {
      const page = await base44.entities.StoryProgress.filter({ child_id: childId }, { sort: "-created_date", limit: 30 });
      return page.items ?? [];
    },
  });
}

export function useNotes(childId) {
  return useQuery({
    queryKey: ["notes", childId],
    enabled: Boolean(childId),
    queryFn: async () => {
      const page = await base44.entities.ParentNote.filter({ child_id: childId }, { sort: "-created_date", limit: 40 });
      return page.items ?? [];
    },
  });
}

export function useAssistantMessages(childId, mode = "child") {
  return useQuery({
    queryKey: ["assistant", childId, mode],
    enabled: Boolean(childId),
    queryFn: async () => {
      const page = await base44.entities.AssistantMessage.filter(
        { child_id: childId, mode },
        { sort: "created_date", limit: 40 },
      );
      return page.items ?? [];
    },
  });
}

/** Private drawings are shown through short-lived signed URLs. */
export async function signedUrlFor(fileUri) {
  if (!fileUri) return null;
  const res = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri, expires_in: 3600 });
  return res?.signed_url ?? null;
}