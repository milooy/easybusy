"use client";

import { Button } from "@/components/ui/button";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface GoogleConnectButtonProps {
  connectedEmails: string[];
  onDisconnect: (tokenId: string) => void;
}

export const GoogleConnectButton = ({ connectedEmails, onDisconnect }: GoogleConnectButtonProps) => {
  const handleConnect = () => {
    window.location.href = '/api/google/auth';
  };

  return (
    <div className={css({ p: "4", bg: "white", borderRadius: "xl", boxShadow: "sm" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "4" })}>
        구글 캘린더 연결
      </h3>

      {connectedEmails.length > 0 && (
        <div className={css({ mb: "4" })}>
          <p className={css({ fontSize: "sm", color: "gray.600", mb: "2" })}>연결된 계정:</p>
          <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
            {connectedEmails.map((email) => (
              <div
                key={email}
                className={flex({ align: "center", justify: "space-between", p: "2", bg: "gray.50", borderRadius: "md" })}
              >
                <span className={css({ fontSize: "sm", color: "gray.700" })}>{email}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleConnect} className={css({ w: "full" })}>
        {connectedEmails.length > 0 ? '다른 구글 계정 추가' : '구글 캘린더 연결하기'}
      </Button>

      {connectedEmails.length === 0 && (
        <p className={css({ mt: "2", fontSize: "xs", color: "gray.500", textAlign: "center" })}>
          구글 캘린더를 연결하면 일정을 확인할 수 있습니다
        </p>
      )}
    </div>
  );
};
