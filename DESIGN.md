# Design System — Li-fe

## Product Context
- **What this is:** 성장형 습관 앱. 할 일을 완료하면 5가지 스탯(체력/지력/지구력/집중/의지력)이 올라감.
- **Who it's for:** 게이미피케이션으로 자기 성장을 관리하고 싶은 사람들
- **Space/industry:** 게이미피케이션 습관 앱 (Habitica, Finch 등과 경쟁)
- **Project type:** 모바일 퍼스트 웹앱

## Aesthetic Direction
- **Direction:** Soft Retro — 레트로 감성은 유지하되 부드럽고 따뜻한 톤
- **Decoration level:** intentional — 소프트 보더, 약한 그림자, 대시 구분선
- **Mood:** 따뜻하고 친근한 다이어리 느낌. 레트로 감성은 은은하게.
- **Key visual elements:** 4px border-radius, 2px solid 보더, 2px offset + 약간의 blur 박스 쉐도우, dashed 구분선
- **Differentiation:** 경쟁앱들이 파스텔 라이트(Finch) 또는 픽셀아트 원색(Habitica)인 반면, Li-fe는 크림 배경 + 테라코타 액센트 + 한글 픽셀 폰트로 따뜻하면서 세련된 소프트 레트로 감성

## Typography
- **Display/Hero (레벨, 칭호):** Galmuri14 — 한글 픽셀 폰트, 큰 사이즈 텍스트용
- **영문 Display:** Press Start 2P — 앱 로고(Li-fe)에만 사용. 나머지 영문은 Galmuri 또는 IBM Plex Mono
- **Body/UI (퀘스트 이름, 본문):** Galmuri11 — 한글 픽셀 폰트, 중간 사이즈
- **Small/Labels (라벨, 메타 정보):** Galmuri9 — 한글 픽셀 폰트, 작은 사이즈
- **Data/Numbers (스탯 숫자):** IBM Plex Mono 600 — 숫자 가독성 + 모노스페이스
- **Code/Fallback:** IBM Plex Mono 400
- **Loading:**
  - Galmuri: `https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css`
  - Press Start 2P: Google Fonts
  - IBM Plex Mono: Google Fonts
- **Scale:**
  - Hero: 28px (Galmuri14)
  - Title: 18px (Galmuri11)
  - Body: 14px (Galmuri11)
  - Small: 12px (Galmuri9)
  - Label: 10px (Galmuri9)
  - Pixel Label: 8px (Press Start 2P, 영문만)

## Color
- **Approach:** balanced — 따뜻한 중성 톤 + 스탯별 포인트 컬러
- **Background (Milk):** #FDF6EC
- **Background Warm (Parchment):** #F5EBDA
- **Surface (Paper):** #FFFDF7
- **Surface 2:** #F0E6D3
- **Border:** #D4C4A8
- **Border Dark:** #B8A88C
- **Accent (Terracotta):** #E8734A — 메인 액센트, CTA, 강조
- **Accent Hover:** #D4603A
- **Accent Dim:** rgba(232, 115, 74, 0.1)
- **Text:** #3D2C1E
- **Text Muted:** #8B7355
- **Text Faint:** #C4B49A

### Stat Colors
- **STR:** #E8453C (레트로 레드)
- **INT:** #4A7DB8 (레트로 블루)
- **END:** #5DB85A (레트로 그린)
- **FOC:** #9B59B6 (레트로 퍼플)
- **WIL:** #E8A634 (레트로 옐로우)

### Semantic
- **Success:** #5DB85A
- **Warning:** #E8A634
- **Error:** #E8453C
- **Info:** #4A7DB8

### Dark mode
- Background: #1A1A2E
- Surface: #242444
- Surface 2: #1E1E38
- Border: #3A3A5C
- Text: #E8DCC8
- Text Muted: #9B8EC4
- Shadow: 3px 3px 0px #12122A

## Spacing
- **Base unit:** 8px
- **Density:** compact
- **Scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48

## Layout
- **Approach:** grid-disciplined
- **Grid:** 2 columns for stat cards, single column for quest list
- **Max content width:** 448px (max-w-md)
- **Border radius:** 4px — 살짝 둥근 모서리. 하위 요소는 2px(rounded-sm)
- **Box shadow:** 2px 2px 0px + 0 1px 4px rgba(0,0,0,0.04) (소프트 offset shadow)
- **Border width:** 2px solid

## Motion
- **Approach:** minimal-functional with pixel steps
- **Easing:** steps() for pixel feel, ease-out for XP bars
- **Duration:** micro(50ms) short(150ms) medium(300ms)
- **XP bar fill:** steps(20) 또는 ease-out, 2s duration
- **Quest appear:** fade + translateY, 200ms
- **Cursor blink:** step-end, 1s infinite

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-02 | 8-bit retro RPG aesthetic | 경쟁앱 리서치 결과 다크 세련 RPG UI가 비어있고, 사용자가 도트/8비트 감성 원함 |
| 2026-04-02 | 크림/밀크 배경 | 사용자 선호. 따뜻한 톤이 RPG 메뉴 화면 느낌과 맞음 |
| 2026-04-02 | Galmuri 한글 픽셀 폰트 | Neo둥근모와 비교 후 선택. 사이즈별(9/11/14) 지원이 장점 |
| 2026-04-02 | 테라코타 액센트 (#E8734A) | 클로드 마스코트 느낌 + 따뜻한 8비트 감성 |
| 2026-04-02 | 직각 모서리 + offset shadow | 픽셀 미학 일관성. 둥근 모서리 사용하지 않음 |
| 2026-04-02 | Soft Retro로 전환 | 게임 느낌이 너무 강해서 성별/취향 무관하게 어필하도록 소프트닝 |
| 2026-04-02 | 앱 이름 StatMe → Li-fe | 더 보편적인 브랜딩, 게임 세계관 탈피 |
| 2026-04-02 | 4px border-radius 도입 | 직각 → 살짝 둥근 모서리로 부드러운 인상 |
| 2026-04-02 | Press Start 2P 로고만 사용 | 게임 폰트 노출 최소화, 라벨은 Galmuri9 한글로 |
| 2026-04-02 | RPG 용어 적정 순화 | 판타지 용어(퀘스트/모험가/전사)는 제거, 일상어(스탯/미션/레벨)는 유지 |
