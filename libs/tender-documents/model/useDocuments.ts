import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '../../http-client';

// Backend Document shape (cf. src/tenders/documents/models.py)
export interface BackendDocument {
  id: string;
  tender_id: string;
  doc_name: string;
  file_type: string;
  uploaded_at: string;
  status: string;          // "raw" | "processed" | "failed_process"
  agents: string[];
}

const documentsKey = (tenderId: string | undefined) => ['documents', tenderId];

/**
 * Liste les documents d'un tender.
 * GET /documents?tender_id=...
 */
export function useDocuments(tenderId: string | undefined) {
  return useQuery({
    queryKey: documentsKey(tenderId),
    queryFn: () =>
      httpClient.get<BackendDocument[]>(`/documents?tender_id=${tenderId}`),
    enabled: !!tenderId,
    staleTime: 10_000,
  });
}

/**
 * Upload de fichiers vers Azurite/Azure Blob pour un tender existant.
 * POST /documents/upload/{tender_id}
 */
export function useUploadDocuments(tenderId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: File[] | FileList) => {
      if (!tenderId) throw new Error('tenderId is required to upload documents');
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append('files', f, f.name));
      return httpClient.post<BackendDocument[]>(
        `/documents/upload/${tenderId}`,
        formData,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKey(tenderId) });
    },
  });
}

/**
 * Suppression d'un document.
 * DELETE /documents/{document_uuid}?tender_uuid=...
 */
export function useDeleteDocument(tenderId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      if (!tenderId) throw new Error('tenderId is required to delete a document');
      return httpClient.delete(
        `/documents/${documentId}?tender_uuid=${tenderId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsKey(tenderId) });
    },
  });
}

/**
 * Helpers d'affichage : taille lisible + temps relatif.
 */
export function formatFileSize(bytes?: number): string {
  if (bytes == null || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.floor(h / 24);
  return `${d} d ago`;
}
