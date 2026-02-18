"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  useUserSettings,
  type UserSettings,
  type OffTimeRange,
} from "@/hooks/useUserSettings";
import { css } from "../../../../styled-system/css";
import { flex } from "../../../../styled-system/patterns";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

const HOUR_OPTIONS = Array.from({ length: 25 }, (_, i) => i);

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function SettingsContent() {
  const router = useRouter();
  const { settings, setSettings } = useUserSettings();

  const [draft, setDraft] = useState<UserSettings>(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleSave = () => {
    setSettings(draft);
    router.push("/app");
  };

  const handleAddOffTime = () => {
    setDraft((prev) => ({
      ...prev,
      dailyOffTimes: [...prev.dailyOffTimes, { startHour: 12, endHour: 13 }],
    }));
  };

  const handleRemoveOffTime = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      dailyOffTimes: prev.dailyOffTimes.filter((_, i) => i !== index),
    }));
  };

  const handleOffTimeChange = (
    index: number,
    field: keyof OffTimeRange,
    value: number
  ) => {
    setDraft((prev) => ({
      ...prev,
      dailyOffTimes: prev.dailyOffTimes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <PageLayout maxWidth="md" showFooter={false}>
      <div className={flex({ align: "center", gap: "2", mb: "6" })}>
        <button
          onClick={() => router.push("/app")}
          className={css({
            p: "1",
            borderRadius: "md",
            cursor: "pointer",
            color: "gray.600",
            _hover: { bg: "gray.100" },
          })}
        >
          <ChevronLeft size={20} />
        </button>
        <h1
          className={css({
            fontSize: "xl",
            fontWeight: "bold",
            color: "gray.900",
          })}
        >
          캘린더 설정
        </h1>
      </div>

      <div
        className={css({
          bg: "white",
          borderRadius: "xl",
          boxShadow: "sm",
          p: "6",
          display: "flex",
          flexDirection: "column",
          gap: "6",
        })}
      >
        {/* 시작 시간 */}
        <div>
          <label
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.700",
              mb: "2",
            })}
          >
            하루 시작 시간
          </label>
          <select
            value={draft.dailyStartTime ?? ""}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                dailyStartTime:
                  e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            className={css({
              w: "full",
              p: "2.5",
              borderRadius: "md",
              border: "1px solid",
              borderColor: "gray.300",
              fontSize: "sm",
              color: "gray.900",
              cursor: "pointer",
              _focus: {
                outline: "none",
                borderColor: "blue.500",
                ring: "1px",
                ringColor: "blue.500",
              },
            })}
          >
            <option value="">설정 안함 (0:00)</option>
            {HOUR_OPTIONS.filter((h) => h < 24).map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </div>

        {/* 종료 시간 */}
        <div>
          <label
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.700",
              mb: "2",
            })}
          >
            하루 종료 시간
          </label>
          <select
            value={draft.dailyEndTime ?? ""}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                dailyEndTime:
                  e.target.value === "" ? null : Number(e.target.value),
              }))
            }
            className={css({
              w: "full",
              p: "2.5",
              borderRadius: "md",
              border: "1px solid",
              borderColor: "gray.300",
              fontSize: "sm",
              color: "gray.900",
              cursor: "pointer",
              _focus: {
                outline: "none",
                borderColor: "blue.500",
                ring: "1px",
                ringColor: "blue.500",
              },
            })}
          >
            <option value="">설정 안함 (24:00)</option>
            {HOUR_OPTIONS.filter((h) => h >= 1).map((h) => (
              <option key={h} value={h}>
                {formatHour(h)}
              </option>
            ))}
          </select>
        </div>

        {/* 쉬는 시간 */}
        <div>
          <div className={flex({ justify: "space-between", align: "center", mb: "2" })}>
            <label
              className={css({
                fontSize: "sm",
                fontWeight: "medium",
                color: "gray.700",
              })}
            >
              쉬는 시간
            </label>
            <button
              onClick={handleAddOffTime}
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "1",
                px: "2",
                py: "1",
                fontSize: "xs",
                color: "blue.600",
                borderRadius: "md",
                cursor: "pointer",
                _hover: { bg: "blue.50" },
              })}
            >
              <Plus size={14} />
              추가
            </button>
          </div>

          {draft.dailyOffTimes.length === 0 && (
            <p className={css({ fontSize: "sm", color: "gray.400" })}>
              설정된 쉬는 시간이 없습니다
            </p>
          )}

          <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
            {draft.dailyOffTimes.map((offTime, index) => (
              <div
                key={index}
                className={flex({ align: "center", gap: "2" })}
              >
                <select
                  value={offTime.startHour}
                  onChange={(e) =>
                    handleOffTimeChange(index, "startHour", Number(e.target.value))
                  }
                  className={css({
                    flex: "1",
                    p: "2",
                    borderRadius: "md",
                    border: "1px solid",
                    borderColor: "gray.300",
                    fontSize: "sm",
                    color: "gray.900",
                    cursor: "pointer",
                  })}
                >
                  {HOUR_OPTIONS.filter((h) => h < 24).map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h)}
                    </option>
                  ))}
                </select>
                <span className={css({ color: "gray.400", fontSize: "sm" })}>~</span>
                <select
                  value={offTime.endHour}
                  onChange={(e) =>
                    handleOffTimeChange(index, "endHour", Number(e.target.value))
                  }
                  className={css({
                    flex: "1",
                    p: "2",
                    borderRadius: "md",
                    border: "1px solid",
                    borderColor: "gray.300",
                    fontSize: "sm",
                    color: "gray.900",
                    cursor: "pointer",
                  })}
                >
                  {HOUR_OPTIONS.filter((h) => h >= 1).map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemoveOffTime(index)}
                  className={css({
                    p: "1.5",
                    color: "red.400",
                    borderRadius: "md",
                    cursor: "pointer",
                    _hover: { bg: "red.50", color: "red.600" },
                  })}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        className={css({
          w: "full",
          mt: "4",
          py: "2.5",
          bg: "blue.600",
          color: "white",
          fontWeight: "medium",
          fontSize: "sm",
          borderRadius: "lg",
          cursor: "pointer",
          _hover: { bg: "blue.700" },
        })}
      >
        저장
      </button>
    </PageLayout>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}
