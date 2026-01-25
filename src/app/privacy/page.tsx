import { css } from "../../../styled-system/css";

export const metadata = {
  title: "개인정보처리방침 | EasyBusy",
};

export default function PrivacyPage() {
  return (
    <div className={css({ minH: "screen", bg: "gray.50", py: "12", px: "4" })}>
      <div className={css({ maxW: "3xl", mx: "auto", bg: "white", borderRadius: "xl", boxShadow: "sm", p: "8" })}>
        <h1 className={css({ fontSize: "2xl", fontWeight: "bold", color: "gray.900", mb: "6" })}>
          개인정보처리방침
        </h1>

        <div className={css({ display: "flex", flexDirection: "column", gap: "6", color: "gray.700", lineHeight: "1.8" })}>
          <p className={css({ color: "gray.500", fontSize: "sm" })}>
            최종 수정일: 2025년 1월 25일
          </p>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              1. 수집하는 개인정보
            </h2>
            <p>
              EasyBusy는 서비스 제공을 위해 다음 정보를 수집합니다:
            </p>
            <ul className={css({ listStyleType: "disc", pl: "6", mt: "2" })}>
              <li>Google 계정 이메일 주소</li>
              <li>Google Calendar 일정 정보 (읽기 전용)</li>
              <li>OAuth 인증 토큰</li>
            </ul>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              2. 개인정보의 이용 목적
            </h2>
            <p>
              수집된 정보는 다음 목적으로만 사용됩니다:
            </p>
            <ul className={css({ listStyleType: "disc", pl: "6", mt: "2" })}>
              <li>Google Calendar 일정 조회 및 표시</li>
              <li>사용자 인증 및 서비스 접근 관리</li>
            </ul>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              3. 개인정보의 보관 및 파기
            </h2>
            <p>
              OAuth 토큰은 암호화되어 안전하게 저장되며, 사용자가 연결을 해제하면 즉시 삭제됩니다.
              서비스 탈퇴 시 모든 개인정보는 지체 없이 파기됩니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              4. 개인정보의 제3자 제공
            </h2>
            <p>
              EasyBusy는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
              단, 법령에 의해 요구되는 경우는 예외로 합니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              5. 사용자의 권리
            </h2>
            <p>
              사용자는 언제든지 다음 권리를 행사할 수 있습니다:
            </p>
            <ul className={css({ listStyleType: "disc", pl: "6", mt: "2" })}>
              <li>Google 계정 연결 해제</li>
              <li>개인정보 삭제 요청</li>
              <li>서비스 탈퇴</li>
            </ul>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              6. 문의
            </h2>
            <p>
              개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
