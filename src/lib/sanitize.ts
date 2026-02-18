import DOMPurify from "dompurify";

/**
 * HTML 문자열에서 XSS 공격 가능성이 있는 요소 제거
 * @param html 정제할 HTML 문자열
 * @returns 안전한 HTML 문자열
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof window === "undefined") {
    // SSR 환경에서는 빈 문자열 반환 (클라이언트에서 다시 렌더링됨)
    return "";
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "b",
      "i",
      "em",
      "strong",
      "a",
      "ul",
      "ol",
      "li",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
};
