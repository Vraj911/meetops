import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONFIDENCE_THRESHOLDS } from "./constants";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getConfidenceLevel(confidence) {
  const percent = confidence > 1 ? confidence : confidence * 100;
  if (percent >= CONFIDENCE_THRESHOLDS.HIGH) return "high";
  if (percent >= CONFIDENCE_THRESHOLDS.MEDIUM) return "medium";
  return "low";
}
function formatConfidence(confidence) {
  const percent = confidence > 1 ? confidence : confidence * 100;
  return `${Math.round(percent)}%`;
}
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getEmailUsername(email) {
  return email.split("@")[0];
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}
export {
  cn,
  delay,
  formatConfidence,
  formatFileSize,
  generateId,
  getConfidenceLevel,
  getEmailUsername,
  getInitials
};
