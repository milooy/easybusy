import { css } from "../../../styled-system/css";

export const metadata = {
  title: "서비스 이용약관 | EasyBusy",
};

export default function TermsPage() {
  return (
    <div className={css({ minH: "screen", bg: "gray.50", py: "12", px: "4" })}>
      <div className={css({ maxW: "3xl", mx: "auto", bg: "white", borderRadius: "xl", boxShadow: "sm", p: "8" })}>
        <h1 className={css({ fontSize: "2xl", fontWeight: "bold", color: "gray.900", mb: "6" })}>
          서비스 이용약관
        </h1>

        <div className={css({ display: "flex", flexDirection: "column", gap: "6", color: "gray.700", lineHeight: "1.8" })}>
          <p className={css({ color: "gray.500", fontSize: "sm" })}>
            최종 수정일: 2025년 1월 25일
          </p>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              1. 서비스 소개
            </h2>
            <p>
              EasyBusy는 Google Calendar와 연동하여 일정을 조회하고 관리할 수 있는 서비스입니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              2. 이용 조건
            </h2>
            <ul className={css({ listStyleType: "disc", pl: "6" })}>
              <li>본 서비스를 이용하려면 Google 계정이 필요합니다.</li>
              <li>사용자는 본인의 계정 정보를 안전하게 관리할 책임이 있습니다.</li>
              <li>서비스를 불법적인 목적으로 사용할 수 없습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              3. 서비스 제공
            </h2>
            <p>
              본 서비스는 &quot;있는 그대로&quot; 제공됩니다. 서비스의 지속적인 제공을 보장하지 않으며,
              사전 통지 없이 서비스 내용이 변경되거나 중단될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              4. 책임의 제한
            </h2>
            <p>
              서비스 이용으로 인해 발생하는 직접적, 간접적 손해에 대해 책임지지 않습니다.
              Google Calendar 데이터의 정확성은 Google에 의해 결정됩니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              5. 지적 재산권
            </h2>
            <p>
              본 서비스의 모든 콘텐츠와 기능에 대한 지적 재산권은 서비스 제공자에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              6. 약관의 변경
            </h2>
            <p>
              본 약관은 필요에 따라 변경될 수 있으며, 변경 시 서비스 내 공지를 통해 안내합니다.
            </p>
          </section>

          <section>
            <h2 className={css({ fontSize: "lg", fontWeight: "semibold", color: "gray.900", mb: "2" })}>
              7. 문의
            </h2>
            <p>
              서비스 이용 관련 문의사항이 있으시면 연락해 주세요.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
