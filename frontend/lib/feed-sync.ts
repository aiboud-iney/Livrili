"use client";

const CACHE_PREFIX = "feed-item-cache";

type CacheType = "route" | "shipment";

const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const getStorageKey = (type: CacheType) => `${CACHE_PREFIX}:${type}`;

export const cacheFeedItem = (type: CacheType, item: Record<string, unknown>) => {
  if (typeof window === "undefined" || !item?.id) return;
  const key = getStorageKey(type);
  const bucket = safeJsonParse<Record<string, Record<string, unknown>>>(window.sessionStorage.getItem(key)) ?? {};
  bucket[String(item.id)] = item;
  window.sessionStorage.setItem(key, JSON.stringify(bucket));
};

export const getCachedFeedItem = <T>(type: CacheType, id: string | number): T | null => {
  if (typeof window === "undefined") return null;
  const key = getStorageKey(type);
  const bucket = safeJsonParse<Record<string, T>>(window.sessionStorage.getItem(key));
  return bucket?.[String(id)] ?? null;
};

export const extractWilayaCode = (value: string) => {
  const [code] = value.split(" - ");
  return code?.trim() ?? value.trim();
};

export const toIsoDate = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [d, m, y] = value.split("/");
    return `${y}-${m}-${d}`;
  }
  return "";
};

export const firstDateFromFilterValue = (value: string) => {
  if (!value) return "";
  const firstToken = value.split("to")[0].split("à")[0].trim().split(" ")[0];
  return toIsoDate(firstToken);
};
