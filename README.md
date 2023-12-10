# Peach-bloom 💄

<img width="1433" alt="peach-bloom" src="https://github.com/Seokho0120/river.dev/assets/93597794/28e8efd5-ec94-44f1-895c-af6076356bdb">

## 소개

유튜브와 인스타그램 클론코딩으로 개발을 처음 접했을때 언젠가는 혼자 백엔드부터 프론트까지, 로그인부터 시작해서 유저가 페이지를 닫을 때 까지의
과정을 개발하고 싶었습니다. 이러한 마음으로 이직 준비를 하며 단기간안에 효율적으로 원하는 기술을 익히면서 개발할 수 있는 주제가 무엇일까 고민했고,
가장 기본이되는 쇼핑몰 웹사이트를 개발하기로 결심했습니다.

peach-bloom은 화장품 쇼핑몰 웹사이트입니다. 소셜 로그인부터 제품 필터와 검색, 좋아요 기능으로 원하는 제품을 찾을 수 있고 장바구니에 담을 수 있습니다.
FireStore를 이용해 데이터 구조를 고민하며 실시간 데이터 동기화를 구현했으며, Cloudinary를 활용해 이미지를 업로드하고 관리하며 최적화에 집중했습니다.

## 폴더 구조

UI와 비지니스 로직을 분리하고, 재사용성을 높이고 의존성을 최소화하기 위해 고민하며 개발했습니다.<br/>
특히, 커스텀훅과 컴포넌트를 최대한 쪼개고 분리하여 명확한 사용성을 정의하고 꼭 필요한 곳에서만 재사용했습니다.

```tsx
📦src
 ┣ 📂app
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┗ 📂[...nextauth]
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📂signIn
 ┃ ┣ 📂carts
 ┃ ┣ 📂detail
 ┃ ┃ ┗ 📂[productId]
 ┃ ┣ 📂mylike
 ┃ ┣ 📂mypage
 ┃ ┣ 📂products
 ┃ ┃ ┗ 📂[categories]
 ┃ ┣ 📂search
 ┃ ┃ ┗ 📂[...keyword]
 ┃ ┣ 📂upload
 ┃ ┃ ┣ 📂[productId]
 ┣ 📂atoms
 ┣ 📂components
 ┃ ┣ 📂ui
 ┣ 📂context
 ┣ 📂hooks
 ┣ 📂lib
 ┣ 📂types
 ┗ 📂utils
```

다만, 개발 완료 후 예상보다 컴포넌트의 수가 더 많아지며 복잡하다는 생각이 들었습니다.
현업에서는 컴포넌트 폴더 내부에 공통 및 페이지별 폴더를 따로 만들어 관리했었는데, 가독성 측면에서 좋지 않다고 판단해 현재 어떻게 리팩토링할지 고민하고 있습니다.

## 구현 페이지

**회원가입 페이지**

- 소셜 회원가입 가능

  개인적으로 일반 회원가입을 해야하는 사이트를 싫어합니다. 편하게 클릭 한번이면 회원가입할 수 있는 소셜 로그인이 좋은 UX라고 생각하기에 `NextAuth`를 이용해 구글과 카카오, 네이버 소셜 로그인을 구현했습니다.

- 어드민 관리자는 UPLOAD 버튼 생성 및 상품 업로드 권한 부여

  특정 계정에 관리자 권한을 설정했습니다. 관리자 계정은 로그인 시 메인 상단 메뉴에 **UPLOAD** 버튼이 생성되고, 상품을 업로드할 수 있습니다.

**메인 페이지**

- 캐러셀을 통해 베스트 상품, 할인 상품, 신상품 확인

  카테고리별로 판매 우선순위를 두는 제품을 위주로 메인페이지에 보여주었습니다.

**상품 목록 페이지**

- 필터를 통해 랭킹, 좋아요, 높은 가격, 낮은 가격, 높은 할인순으로 상품 확인 가능
- 브랜드명을 클릭하여 해당 카테고리 내 브랜드 상품 확인 가능

  쇼핑몰을 이용하며 필터를 통해 상품을 찾은 후 초기화 버튼이 없을때 불편함을 느낀 경험이 있습니다.<br/>
  그래서 **전체+** 버튼을 통해 필터와 브랜드가 초기화될 수 있도록 개발했습니다.

**상품 상세 페이지**

- 비로그인 시 하트 버튼을 클릭하면 로그인 페이지로 이동
- 우측 상단의 하트 버튼을 클릭해 해당 상품을 MY LIKE 페이지에 저장 및 삭제
- 수량 선택 후 장바구니 담기 및 바로 구매

  비로그인 상태로 좋아요 버튼을 클릭 시 모달이 보여지고, 모달의 버튼을 클릭해야 로그인 페이지로 넘어가는 쇼핑몰이 많았습니다.
  하지만 저는 쇼핑몰에 고객을 적극적으로 유입시키려면 모달이 아닌, **즉시 로그인 페이지로 이동**하는 UX가 더 비지니스에 도움이 된다 생각했습니다.

**장바구니 페이지**

- 장바구니에 담긴 제품의 수량 변경 가능
- 장바구니에 담긴 모든 제품의 총 주문 금액 및 결제 금액 확인
- 각각의 상품 삭제 가능

  장바구니에 제품을 담거나 삭제 시 `FireStore`에 실시간 업데이트가 됩니다. MVP를 구성할 때 결제 기능을 추가할지 고민했지만,
  결제 기능이 퍼포먼스에 큰 영향이 있지 않을 것이라 판단하여 추후에 개발 예정입니다.

**검색 페이지**

- 키워드에 해당하는 제품 확인 가능
- 키워드 검색 시 검색 페이지 이동, 키워드 삭제 시 메인 페이지 이동

  현업에서 검색 기능을 개발하며, 키워드 당 매번 API 호출이 되어 서버 과부화 이슈를 직면한 경험이 있습니다.
  그 당시 해결방법이 떠오르지 않아 검색 버튼을 클릭 시 결과가 나오는 방향으로 기획을 수정했습니다.<br/>
  하지만 이번 프로젝트에서는 실시간 검색 기능을 구현하고 싶어, 방법을 찾다가 `Debounce`와 `Throttle` 개념을 학습하고,
  **Debounce 커스텀훅**을 만들어 이슈를 해결했습니다.

**마이 페이지**

- 계정(이메일), 닉네임, 프로필 사진 확인 가능
- 해당 페이지에서 로그아웃 가능

**좋아요 페이지**

- 유저가 하트를 클릭한 제품 목록 확인 가능
- 해당 제품 클릭 시 상세 페이지 이동

**업로드 페이지**

- 어드민 관리자는 새로운 상품 등록 가능

  관리자 계정으로 새로운 상품을 업로드할 수 있습니다.
  `FireStore`에 업로드하기 전 이미지를 `Cloudinary`에 저장하고, **이미지 url**을 받아 FireStore에 저장합니다.
