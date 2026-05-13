export type SyncHistoryEntry = {
  timestamp: Date;
  field: string;
  value: any;
  error?: string;
};

export type SyncStatus = "idle" | "saved" | "error";
