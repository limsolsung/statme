# Design System — StatMe

## Product Context
- **What this is:** RPG 감성 투두앱. 할 일을 완료하면 캐릭터 스탯(STR/INT/END/FOC/WIL)이 올라감.
- **Who it's for:** 게임처럼 생산성을 관리하고 싶은 사람들
- **Space/industry:** 게임화 생산성 앱 (Habitica, Finch 등과 경쟁)
- **Project type:** 모바일 퍼스트 웹앱

## Aesthetic Direction
- **Direction:** 8-bit Retro RPG
- **Decoration level:** intentional — 픽셀 보더, 도트 그림자, 대시 구분선
- **Mood:** 따뜻하고 레트로한 RPG 메뉴 화면. 클래식 게임의 캐릭터 스탯 페이지 느낌.
- **Key visual elements:** 직각 모서리, 3px solid 보더, 2px offset 박스 쉐도우, dashed 구분선
- **Differentiation:** 경쟁앱들이 파스텔 라이트(Finch) 또는 픽셀아트 원색(Habitica)인 반면, StatMe는 크림 배경 + 테라코타 액센트 + 한글 픽셀 폰트로 따뜻하면서 세련된 레트로 감성

## Typography
- **Display/Hero (레벨, 칭호):** Galmuri14 — 한글 픽셀 폰트, 큰 사이즈 텍스트용
- **영문 Display:** Press Start 2P — 영문 전용 8비트 폰트, Galmuri와 교차 사용
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
- **Border radius:** 0px — 전부 직각. 픽셀 미학에 둥근 모서리 없음
- **Box shadow:** 3px 3px 0px (offset shadow, no blur)
- **Border width:** 2-3px solid

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
