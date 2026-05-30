# 토스 프론트엔드의 모든 것

토스(Toss/비바리퍼블리카)의 프론트엔드 기술 스택, 아키텍처, 개발 문화, 오픈소스 생태계를 종합 정리한 가이드입니다.

---

## 1. 핵심 기술 스택

| 영역 | 기술 |
|------|------|
| UI 프레임워크 | React |
| 언어 | TypeScript (전체 코드베이스) |
| 프레임워크 | Next.js (SSR, Static Export) |
| 스타일링 | Emotion (CSS Prop), vanilla-extract |
| 서버 상태 | React Query, SWR |
| 클라이언트 상태 | Jotai |
| 패키지 매니저 | pnpm (최근), Yarn Berry (이전) |
| 모노레포 도구 | Turborepo |
| 모바일 | React Native |

---

## 2. 모노레포 아키텍처

토스의 가장 핵심적인 인프라 결정 중 하나이다.

- 토스코어, 토스증권, 토스페이먼츠, 토스뱅크, 토스인슈어런스 **전 계열사가 모노레포** 채택
- 토스코어의 `toss-frontend` 레포 하나에 **80~100개 이상의 서비스**가 공존

### 모노레포의 장점

- 새 서비스/라이브러리를 빠르게 생성할 수 있다
- 공통 코드 공유가 용이하다
- 공용 라이브러리 버전을 통일할 수 있다
- 기술 부채를 감소시키고 서비스 간 개발 경험을 통일할 수 있다

### 모노레포 디렉토리 구조 (추정)

```
toss-frontend/
├── apps/                    # 서비스 애플리케이션 (80~100개)
│   ├── toss-app/            # 토스 앱 웹뷰
│   ├── toss-securities/     # 토스증권
│   ├── toss-payments/       # 토스페이먼츠
│   └── ...
├── packages/                # 공유 라이브러리
│   ├── tds/                 # Toss Design System
│   ├── utils/               # @toss/utils
│   ├── react/               # @toss/react
│   └── ...
├── turbo.json               # Turborepo 태스크 설정
├── package.json             # 루트 워크스페이스 설정
└── .yarnrc.yml              # Yarn Berry 설정
```

---

## 3. 인프라 & 빌드 시스템

프론트엔드 플랫폼을 구축할 때 가장 핵심이 되는 인프라 세팅을 정리한다.

### 3-1. 패키지 매니저: Yarn Berry (PnP)

토스는 Yarn Berry의 PnP(Plug'n'Play) 모드를 사용한다.

#### 선택 이유

| 기준 | Yarn PnP | pnpm | npm |
|------|----------|------|-----|
| 설치 방식 | JavaScript 객체 맵 | Hard Link | node_modules 복사 |
| node_modules | 완전 제거 | 심볼릭 링크 | 전체 생성 |
| 설치 속도 | 가장 빠름 | 빠름 | 느림 |
| 엄격성 | 가장 엄격 (팬텀 의존성 차단) | 엄격 | 느슨 |
| 아키텍처 모듈화 | Resolution/Fetch/Link 분리 | 부분 분리 | 일체형 |

#### 패키지 매니저의 3단계 설치 프로세스

1. **Resolution** - 버전 범위를 구체적 버전으로 고정, 의존성의 의존성까지 파악
2. **Fetch** - 결정된 버전을 npm 레지스트리에서 다운로드
3. **Link** - 설치된 라이브러리를 소스 코드에서 사용 가능하게 구성

#### Yarn PnP의 장점

- `node_modules` 완전 제거로 파일 I/O 최소화
- 엄격한 의존성 관리로 팬텀 디펜던시 문제 원천 차단
- PnP의 엄격한 규칙 덕분에 npm/pnpm에서도 작동이 보장됨
- 플러그인 API가 풍부해 자체 기능 추가 용이

#### Zero-Install 전략 변화

토스는 초기에 Zero-install(의존성을 Git에 커밋)을 도입했으나, 현재는 비활성화하는 방향으로 전환 중이다.

| 구분 | 초기 | 현재 |
|------|------|------|
| 방식 | 의존성을 Git에 커밋 | `yarn install` 매번 실행 |
| 전환 이유 | 레포 크기 증가, `.pnp.cjs` 충돌 빈번, Git 성능 저하 | 더 나은 저장소 관리를 우선시 |

### 3-2. 모노레포 빌드: Turborepo

Turborepo는 Vercel에서 만든 JS/TS 기반 모노레포 빌드 시스템이다.

#### 핵심 기능

- **빌드 캐싱** - 변경되지 않은 패키지는 캐시에서 즉시 복원
- **병렬 실행** - 의존성 그래프를 분석해 독립적인 태스크를 동시 실행
- **원격 캐시** - CI 환경이 매번 초기화되어도 이전 빌드 결과를 원격 저장소에서 재사용
- **태스크 파이프라인** - 빌드, 린트, 타입 체크 등 태스크 간 의존성을 선언적으로 정의

#### turbo.json 설정 예시

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": []
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

#### CI/CD에서의 효과

- 빌드 캐싱으로 CI 시간 50% 이상 단축
- 변경된 패키지만 빌드/테스트하여 불필요한 작업 제거
- PR 머지 시마다 벤치마크 실행으로 성능 회귀 감지

### 3-3. SSR 서버 최적화

토스는 Next.js 기반 SSR을 사용하며, 서버 비용 최적화에 많은 노력을 기울인다.

#### 성능 측정 인프라

| 항목 | 내용 |
|------|------|
| 측정 환경 | EC2 스팟 인스턴스로 격리된 벤치마크 환경 구축 |
| 핵심 메트릭 | RPS(Request Per Second), Event Loop Lag/Utilization |
| 자동화 | PR 머지 시마다 벤치마크 자동 실행으로 지속적 모니터링 |

#### 구체적 최적화 사항

| 개선 항목 | 내용 | 효과 |
|-----------|------|------|
| Serializer 제거 | React Query prefetch 데이터의 불필요한 직렬화/역직렬화 과정 제거 | 응답 시간 단축 |
| Yarn 버전 업그레이드 | 3.2.4 → 3.6.1로 모듈 resolve 오버헤드 감소 | 처리량 향상 |
| Express 제거 | Node.js 내장 http 서버로 교체 | CPU 사용량 4~5%p 감소 |

#### 최종 성과

- CPU 사용률 약 **20% 감소**
- 비례하는 **서버 수 감축**으로 운영 비용 개선

### 3-4. 초기 렌더링 최적화

토스페이먼츠는 JAM Stack + SSG(Static Site Generation) 전략을 도입했다.

#### 인프라 구성

```
빌드 → S3 (정적 파일) → CloudFront (CDN) → Lambda@edge (엣지 로직)
```

#### 최적화 전략

1. **SSG(Static Site Generation)** - 빌드 시점에 페이지를 미리 렌더링하여 빈 HTML 제거
2. **Suspense 커스텀 래핑** - SSG 중에는 fallback만 렌더링하도록 구성
3. **API 독립 격리** - 각 API를 독립적으로 호출하여 상호 의존성 제거
4. **로딩 UI 최적화** - 로딩 상태 UI를 최종 상태와 유사하게 설계

#### 성과

- FP(First Paint) → LCP(Largest Contentful Paint) 간격: **484ms → 0ms**
- 사용자가 흰 화면 대신 즉시 렌더링된 콘텐츠 확인 가능

### 3-5. Critical CSS 최적화

토스는 Emotion(CSS-in-JS)을 사용하면서 SSR 시 Critical CSS를 최적화한다.

| 전략 | 내용 |
|------|------|
| 서버사이드 CSS 추출 | SSR 시점에 해당 페이지에 필요한 CSS만 추출하여 `<style>` 태그에 인라인 |
| CSS 캐싱 | 서버사이드에서 생성된 Critical CSS를 캐싱하여 재생성 비용 제거 |
| 번들 분리 | 페이지별로 필요한 CSS만 로드하여 불필요한 CSS 전송 방지 |

### 3-6. ESLint & 코드 컨벤션

토스는 자체 ESLint 플러그인을 만들어 코드 품질을 자동으로 강제한다.

#### @toss/eslint-plugin-frontend-conventions

토스 프론트엔드 코드 컨벤션을 ESLint 룰로 자동화한 플러그인이다.

#### 주요 컨벤션 영역

| 영역 | 규칙 |
|------|------|
| TypeScript | strict mode 필수, `any` 사용 금지 |
| 네이밍 | 컴포넌트는 PascalCase, 훅은 use 접두어, 상수는 UPPER_SNAKE_CASE |
| 컴포넌트 | 단일 책임 원칙, 한 파일에 하나의 export 컴포넌트 권장 |
| 의존성 | React hooks 규칙 준수, TanStack Query 규칙 포함 |
| 에러 처리 | ErrorBoundary 사용 강제, try-catch 남용 경고 |

### 3-7. 성능 모니터링

| 메트릭 | 설명 |
|--------|------|
| FCP (First Contentful Paint) | 첫 콘텐츠가 화면에 나타나는 시점 |
| LCP (Largest Contentful Paint) | 가장 큰 콘텐츠가 나타나는 시점 |
| CLS (Cumulative Layout Shift) | 레이아웃 밀림 정도 |
| TTFB (Time To First Byte) | 서버 응답 시간 |
| RPS (Request Per Second) | 서버 처리량 |
| Event Loop Lag | Node.js 이벤트 루프 지연 시간 |

### 3-8. 인프라 세팅 체크리스트

프론트엔드 플랫폼을 처음부터 구축할 때 토스의 접근을 참고한 체크리스트이다.

#### Phase 1: 기반 구축

- [ ] 모노레포 초기화 (Turborepo + Yarn Berry 또는 pnpm)
- [ ] TypeScript strict mode 설정
- [ ] ESLint + Prettier 공유 컨피그 생성
- [ ] 공통 tsconfig 설정 (base, react, next 등)
- [ ] 워크스페이스 구조 설계 (apps/, packages/)

#### Phase 2: 빌드 & 배포

- [ ] Turborepo 파이프라인 설정 (build, lint, typecheck, test)
- [ ] CI/CD 파이프라인 구성 (PR별 빌드 검증)
- [ ] 원격 캐시 설정 (Vercel Remote Cache 또는 자체 구축)
- [ ] 배포 파이프라인 (Preview → Staging → Production)
- [ ] PR 머지 시 자동 벤치마크 실행

#### Phase 3: 공통 라이브러리

- [ ] 디자인 시스템 패키지 생성
- [ ] 공통 유틸리티 패키지 (@org/utils)
- [ ] React 공통 훅/컴포넌트 패키지 (@org/react)
- [ ] ESLint 컨벤션 플러그인 (@org/eslint-plugin)
- [ ] 공통 API 클라이언트 설정

#### Phase 4: 개발 경험(DX)

- [ ] 새 서비스 스캐폴딩 CLI/템플릿
- [ ] 로컬 개발 환경 자동 설정 스크립트
- [ ] Storybook 공용 설정
- [ ] 성능 모니터링 대시보드 (Core Web Vitals)
- [ ] 에러 추적 시스템 연동 (Sentry 등)

#### Phase 5: 품질 관리

- [ ] 코드 리뷰 가이드라인 문서화
- [ ] Frontend Fundamentals 스타일의 코드 품질 기준 수립
- [ ] 자동화된 접근성 검사
- [ ] 번들 사이즈 모니터링 (PR별 사이즈 변화 리포트)
- [ ] 시각적 회귀 테스트 (Chromatic 등)

---

## 4. 디자인 시스템 (TDS - Toss Design System)


- **수백 개의 컴포넌트와 템플릿**으로 구성
- 디자인 도구에만 머무르지 않고 **개발 코드와 직접 연결**
- 디자이너/개발자/기획자가 **같은 기준**으로 협업
- 패턴화 + 심미적 경험 + 접근성 3가지 축으로 설계

### 설계 원칙

| 축 | 내용 |
|----|------|
| 패턴화 | 사용량 기반으로 기본형 지정, 비율 기반 최소/최대 너비, 스크롤 흐림 효과 |
| 심미적 경험 | 블러 효과, 밝은 외곽선, 투명도/위치/속도/가속도 기반 인터랙션 |
| 접근성 | 큰 텍스트 환경 대응, 음성 읽기 기능 대응, 초점 지정 |

### 성과

- **3~5배 생산성 향상** (월 30개 화면 → 90개 화면 제작 가능)
- 메이커 1인당 하루 평균 1시간 절약, 전사 기준 총 4,500시간 절약
- 프론트엔드 개발자는 TDS 컴포넌트 배치를 위한 CSS 작성에 집중

---

## 5. 선언적 프로그래밍 패턴

토스가 가장 중시하는 프론트엔드 철학이다.

> 선언적 코드 = "추상화 레벨이 높아진 코드"

### 명령형 vs 선언적

```tsx
// 명령형 (토스가 지양)
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user?.name}</div>;
}

// 선언적 (토스가 지향)
function UserProfile() {
  const user = useSuspenseQuery({ queryFn: fetchUser });
  return <div>{user.data.name}</div>;
}

// 상위에서 선언적으로 처리
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Spinner />}>
    <UserProfile />
  </Suspense>
</ErrorBoundary>
```

### 대표 패턴들

**useOverlay Hook** - 오버레이 상태관리 추상화

```tsx
overlay.open(({ isOpen, close }) => (
  <BottomSheet open={isOpen} onClose={close} />
))
```

**ImpressionArea** - IntersectionObserver 추상화

```tsx
<ImpressionArea onImpressionStart={() => { /* 로깅 */ }}>
```

**LoggingClick** - 이벤트 로깅 선언적 처리

```tsx
<LoggingClick params={{ price }}>
  <button onClick={buy}>구매</button>
</LoggingClick>
```

**useFunnel** - 다단계 플로우 선언적 관리

```tsx
const [Funnel, setStep] = useFunnel(['이름입력', '주소입력', '완료'] as const);

return (
  <Funnel>
    <Funnel.Step name="이름입력">
      <이름입력폼 onNext={() => setStep('주소입력')} />
    </Funnel.Step>
    <Funnel.Step name="주소입력">
      <주소입력폼 onNext={() => setStep('완료')} />
    </Funnel.Step>
    <Funnel.Step name="완료">
      <완료화면 />
    </Funnel.Step>
  </Funnel>
);
```

### 핵심 통찰

- 선언적 코드는 동작 의도를 명확하게 표현하되 오버 엔지니어링을 피해야 한다
- 공유 컴포넌트가 변동성이 크면 오히려 복잡성을 증가시킬 수 있다
- 제품 변화를 예측하고 적절한 추상화 수준을 설정하는 것이 중요하다

---

## 6. Frontend Fundamentals (코드 품질 기준)

> 핵심 철학: "좋은 프론트엔드 코드 = 수정하기 쉬운 코드"

4가지 판단 기준으로 코드 리뷰, 새 코드 작성, 리팩토링에 피드백을 제공한다.

### 6-1. 가독성 (Readability)

- **맥락 줄이기** - 6~7개 맥락을 동시에 고려할 수 있도록 추상화
- **이름 붙이기** - 의도를 드러내는 이름 사용
- **위에서 아래로 읽히게 하기** - 흐름이 자연스러운 코드

### 6-2. 예측 가능성 (Predictability)

- **이름 겹치지 않게 관리** - 동일한 이름이 다른 동작을 하지 않도록
- **반환 타입 통일** - 일관된 인터페이스
- **숨은 로직 드러내기** - 사이드 이펙트를 명확히 표현

### 6-3. 응집도 (Cohesion)

- **함께 수정되는 파일 관리** - 같은 경로에 배치
- **매직 넘버 제거** - 의미를 부여
- **폼의 응집도 고려** - 관련 상태를 함께 관리

### 6-4. 결합도 (Coupling)

- **책임 개별 관리** - 단일 책임 원칙
- **중복 코드 허용** - 과한 추상화 방지
- **Props Drilling 제거** - 적절한 상태 끌어올리기

### 리팩토링 원칙

| 원칙 | 설명 |
|------|------|
| 과한 추상화 금지 | 한 곳에서만 쓰이는 추상화는 오히려 복잡도 증가 |
| 선언적 에러 처리 | try-catch 대신 ErrorBoundary + throwOnError 패턴 |
| Suspense 기반 로딩 | 로딩 상태를 컴포넌트 내부가 아닌 상위에서 선언적으로 처리 |
| 스타일 선언 일관성 | 인라인 스타일 최소화, CSS-in-JS로 통일 |
| 쿼리 훅 반환 패턴 통일 | 데이터 페칭 훅은 일관된 반환 패턴 유지 |

---

## 7. 오픈소스 생태계

### 주요 프로젝트

| 프로젝트 | 설명 | GitHub |
|----------|------|--------|
| slash | 30+ npm 패키지, 토스 공통 TypeScript/JavaScript 라이브러리 | [toss/slash](https://github.com/toss/slash) |
| es-toolkit | lodash 대체, 2~3배 빠르고 97% 작은 유틸리티 라이브러리 | [toss/es-toolkit](https://github.com/toss/es-toolkit) |
| suspensive | React Suspense/ErrorBoundary를 프로덕션에서 우아하게 다루는 라이브러리 | [toss/suspensive](https://github.com/toss/suspensive) |
| frontend-fundamentals | 코드 품질 가이드 | [toss/frontend-fundamentals](https://github.com/toss/frontend-fundamentals) |
| use-funnel | 다단계 플로우 URL 기반 관리 훅 | [toss/use-funnel](https://github.com/toss/use-funnel) |
| overlay-kit | 오버레이 명령형 제어 라이브러리 | [toss/overlay-kit](https://github.com/toss/overlay-kit) |

### @toss/ npm 패키지 목록

| 패키지 | 역할 |
|--------|------|
| `@toss/use-funnel` | 다단계 퍼널 상태 관리 (URL 기반) |
| `@toss/use-overlay` | 모달/바텀시트 명령형 제어 |
| `@toss/utils` | 순수 JS 유틸리티 함수 |
| `@toss/react` | React 전용 훅/컴포넌트 |
| `@toss/hangul` | 한글 처리 (초성 검색, 자모 분리) |
| `@toss/storage` | 타입 안전 localStorage 래퍼 |
| `@toss/validators` | 주민번호, 카드번호 등 금융 도메인 검증 |
| `@toss/impression-area` | 요소 노출 감지 (IntersectionObserver) |
| `@toss/async` | Promise 유틸리티 (retry, timeout, delay) |
| `@toss/date` | 날짜 유틸리티 |
| `@toss/query-string` | URL 쿼리 스트링 파싱 |
| `@toss/event-emitter` | 타입 안전 EventEmitter |
| `@toss/eslint-plugin-frontend-conventions` | 토스 프론트엔드 컨벤션 ESLint 플러그인 |
| `@toss/react-query-extends` | TanStack Query 확장 |

### es-toolkit 주요 함수

| 카테고리 | 함수 |
|----------|------|
| Array | `chunk`, `flatten`, `uniq`, `groupBy`, `intersection`, `difference`, `zip` |
| Object | `pick`, `omit`, `mapKeys`, `mapValues`, `merge`, `cloneDeep` |
| String | `camelCase`, `snakeCase`, `pascalCase`, `trim` |
| Function | `debounce`, `throttle`, `memoize`, `curry`, `once` |
| Predicate | `isNil`, `isObject`, `isString`, `isEmpty` |

### suspensive 패키지

| 패키지 | 역할 |
|--------|------|
| `@suspensive/react` | Suspense, ErrorBoundary 컴포넌트 강화판 |
| `@suspensive/react-query` | TanStack Query의 useSuspenseQuery 안전 래핑 |
| `@suspensive/jotai` | Jotai 상태를 Suspense와 함께 사용 |
| `@suspensive/cache` | Suspense 친화적 캐시 유틸리티 |

---

## 8. 프론트엔드 플랫폼 구축 시 토스에서 배울 점

프론트엔드 플랫폼을 만들고자 한다면 토스의 접근에서 다음을 참고할 수 있다.

1. **모노레포 + Turborepo** - 서비스 간 코드 공유와 일관성 확보
2. **디자인 시스템 (TDS)** - 코드와 직결된 컴포넌트 라이브러리로 생산성 극대화
3. **선언적 비동기 처리** - Suspense + ErrorBoundary + React Query 기반 표준
4. **코드 품질 가이드** - Frontend Fundamentals 같은 명문화된 코드 기준
5. **공통 라이브러리 생태계** - @toss/ 패키지처럼 팀 전용 유틸리티

### 플랫폼팀의 핵심 담당 영역

| 영역 | 내용 |
|------|------|
| 빌드 시스템 | 공통 빌드 설정, 모노레포 관리 |
| 공통 패키지 | 내부 라이브러리 제작 및 오픈소스화 |
| 디자인 시스템 | TDS 구현체 관리, 컴포넌트 라이브러리 |
| 개발 경험(DX) | ESLint 룰, 코드 컨벤션, CI/CD 파이프라인 |
| 성능 모니터링 | FCP, LCP 등 웹 바이탈 추적 및 개선 인프라 |

---

## 참고 자료

- [선언적인 코드 작성하기](https://toss.tech/article/frontend-declarative-code)
- [토스 디자이너가 제품에만 집중할 수 있는 방법](https://toss.tech/article/toss-design-system)
- [패키지 매니저의 과거, 토스의 선택, 그리고 미래](https://toss.tech/article/lightning-talks-package-manager)
- [SSR 서버 최적화로 비용 아끼기](https://toss.tech/article/ssr-server)
- [조금만 신경써서 초기 렌더링 빠르게 하기](https://toss.tech/article/faster-initial-rendering)
- [Frontend Fundamentals](https://frontend-fundamentals.com/)
- [GitHub - toss/slash](https://github.com/toss/slash)
- [GitHub - toss/es-toolkit](https://github.com/toss/es-toolkit)
- [GitHub - toss/suspensive](https://github.com/toss/suspensive)
- [GitHub - toss/frontend-fundamentals](https://github.com/toss/frontend-fundamentals)
- [toss.tech 블로그](https://toss.tech)
