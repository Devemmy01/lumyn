import type { IconType } from "react-icons";
import {
  SiCplusplus,
  SiGo,
  SiJavascript,
  SiOpenjdk,
  SiPython,
  SiRust,
  SiSharp,
  SiTypescript,
} from "react-icons/si";
import type { AcademyLanguageId } from "@/lib/academy";

const LANGUAGE_ICON: Record<AcademyLanguageId, { icon: IconType; color: string }> = {
  python: { icon: SiPython, color: "#3776AB" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  cpp: { icon: SiCplusplus, color: "#00599C" },
  java: { icon: SiOpenjdk, color: "#EA2D2E" },
  go: { icon: SiGo, color: "#00ADD8" },
  rust: { icon: SiRust, color: "#CE422B" },
  csharp: { icon: SiSharp, color: "#68217A" },
};

export function LanguageLogo({
  language,
  className = "h-5 w-5",
}: {
  language: string;
  className?: string;
}) {
  const entry = LANGUAGE_ICON[language as AcademyLanguageId];
  if (!entry) return null;
  const Icon = entry.icon;
  return <Icon aria-hidden="true" className={className} style={{ color: entry.color }} />;
}
