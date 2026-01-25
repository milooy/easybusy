"use client";

import { GoogleEvent, getEventTimes } from "@/lib/google-calendar";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface EventDetailModalProps {
  event: GoogleEvent | null;
  onClose: () => void;
}

export const EventDetailModal = ({ event, onClose }: EventDetailModalProps) => {
  if (!event) return null;

  const { start, end, isAllDay } = getEventTimes(event);

  const formatDateTime = (date: Date) => {
    if (isAllDay) {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={css({
          position: "fixed",
          inset: 0,
          bg: "black/50",
          zIndex: 40,
        })}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={css({
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          w: "full",
          maxW: "md",
          bg: "white",
          borderRadius: "xl",
          boxShadow: "xl",
          zIndex: 50,
          p: "6",
        })}
      >
        {/* Header */}
        <div className={flex({ justify: "space-between", align: "start", mb: "4" })}>
          <div className={flex({ align: "center", gap: "3" })}>
            <div
              className={css({ w: "4", h: "4", borderRadius: "sm", flexShrink: 0 })}
              style={{ backgroundColor: event.calendarColor || "#4285f4" }}
            />
            <h3 className={css({ fontSize: "xl", fontWeight: "semibold", color: "gray.900" })}>
              {event.summary || "(제목 없음)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={css({
              p: "1",
              borderRadius: "md",
              color: "gray.500",
              cursor: "pointer",
              _hover: { bg: "gray.100" },
            })}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
          {/* 시간 */}
          <div className={flex({ align: "start", gap: "3" })}>
            <span className={css({ fontSize: "lg" })}>🕐</span>
            <div>
              <div className={css({ color: "gray.900" })}>{formatDateTime(start)}</div>
              {!isAllDay && (
                <div className={css({ color: "gray.600", fontSize: "sm" })}>
                  ~ {formatDateTime(end)}
                </div>
              )}
              {isAllDay && (
                <div className={css({ color: "gray.500", fontSize: "sm" })}>종일</div>
              )}
            </div>
          </div>

          {/* 장소 */}
          {event.location && (
            <div className={flex({ align: "start", gap: "3" })}>
              <span className={css({ fontSize: "lg" })}>📍</span>
              <div className={css({ color: "gray.700" })}>{event.location}</div>
            </div>
          )}

          {/* 설명 */}
          {event.description && (
            <div className={flex({ align: "start", gap: "3" })}>
              <span className={css({ fontSize: "lg" })}>📝</span>
              <div
                className={css({ color: "gray.700", fontSize: "sm", whiteSpace: "pre-wrap" })}
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          )}

          {/* Google Calendar 링크 */}
          <a
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              mt: "2",
              color: "blue.600",
              fontSize: "sm",
              _hover: { textDecoration: "underline" },
            })}
          >
            Google Calendar에서 보기 →
          </a>
        </div>
      </div>
    </>
  );
};
