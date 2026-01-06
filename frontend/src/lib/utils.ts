import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONFIDENCE_THRESHOLDS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get confidence level based on percentage
 */
export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  const percent = confidence > 1 ? confidence : confidence * 100;
  if (percent >= CONFIDENCE_THRESHOLDS.HIGH) return 'high';
  if (percent >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}

/**
 * Format confidence as percentage string
 */
export function formatConfidence(confidence: number): string {
  const percent = confidence > 1 ? confidence : confidence * 100;
  return `${Math.round(percent)}%`;
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Extract email username
 */
export function getEmailUsername(email: string): string {
  return email.split('@')[0];
}

/**
 * Delay utility for simulated loading
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a mock ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}
