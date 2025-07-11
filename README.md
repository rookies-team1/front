# Frontend 개발 명세서

## 1. 기술 스택

- **Framework**: React 19.1.0  
- **언어**: JavaScript (with @types/react, @types/react-dom)  
- **상태 관리**: Zustand 5.0.6  
- **라우팅**: React Router DOM 7.6.3  
- **스타일링**: Tailwind CSS 3.3.5  
- **빌드 도구**: Vite 7.0.0  
- **HTTP 클라이언트**: Axios 1.10.0  
- **PDF 처리**: pdfjs-dist 5.3.31  
- **알림 처리**: react-hot-toast 2.5.2  
- **아이콘**: react-icons 5.5.0  
- **ESLint**: 9.29.0  
  - `eslint-plugin-react-hooks`  
  - `eslint-plugin-react-refresh`
 
## 2. 프로젝트 구조
```
MYPRJ3_VER2/
├── .github/
│   └── workflows/
│       └── main.yml              # GitHub Actions CI/CD 설정
├── favicon/                      # 사이트 파비콘 리소스
├── nginx/
│   └── nginx.conf                # Nginx 정적 파일 서빙 설정
├── public/                       # 정적 파일 (index.html 포함)
├── src/
│   ├── components/               # 재사용 UI 컴포넌트
│   │   ├── CategoryFilter.jsx    # 기업 카테고리 필터 버튼
│   │   ├── ChatBox.jsx           # AI 분석 챗 UI
│   │   ├── FileUploadArea.jsx    # PDF/TXT 파일 업로드 및 텍스트 추출
│   │   ├── Navbar.jsx            # 상단 네비게이션 바
│   │   ├── NewsList.jsx          # 뉴스 카드 리스트
│   │   ├── Pagination.jsx        # 뉴스 페이지네이션
│   │   ├── PublishDate.jsx       # 뉴스 출간일 컴포넌트
│   │   └── ViewToggle.jsx        # 전체/요약 보기 전환 버튼
│   ├── hooks/                    # 커스텀 훅
│   │   ├── useAuth.js            # 인증 관련 훅
│   │   └── useForm.js            # 폼 처리 훅
│   ├── pages/                    # 라우팅되는 주요 페이지
│   │   ├── Bookmark.jsx          # 즐겨찾기 뉴스 목록
│   │   ├── Home.jsx              # 메인 뉴스 목록 페이지
│   │   ├── Login.jsx             # 로그인 페이지
│   │   ├── NewsDetail.jsx        # 뉴스 상세 및 요약/AI 분석
│   │   └── Signup.jsx            # 회원가입 페이지
│   ├── store/                    # Zustand 전역 상태 관리
│   │   ├── bookmarkStore.js      # 북마크 상태 관리
│   │   └── userStore.js          # 사용자 상태 관리
│   ├── utils/                    # API 및 유틸 함수
│   │   ├── api.js                # API 요청 함수 모음
│   │   ├── axiosInstance.js      # axios 인스턴스 설정
│   │   └── validation.js         # 입력값 유효성 검증
│   ├── App.jsx                   # 전체 라우팅 및 구조 컴포넌트
│   ├── index.css                 # 전역 스타일 (Tailwind)
│   └── main.jsx                  # React 진입점
├── .env                          # 환경변수 파일
├── Dockerfile                    # 멀티스테이지 빌드 정의
├── docker-compose.yml           # Docker 서비스 정의
├── vite.config.js                # Vite 설정
├── tailwind.config.js           # Tailwind 설정
└── package.json                 # 프로젝트 설정 및 의존성
```

## 3. 환경 설정
```env
# .env
VITE_API_URL=http://18.233.156.168:8080
```


## 4. 주요 페이지

| 페이지 경로   | 컴포넌트     | 기능 설명                          |
|---------------|--------------|------------------------------------|
| `/`           | Home         | 기업 카테고리별 뉴스 목록 표시     |
| `/login`      | Login        | 사용자 로그인 폼                  |
| `/signup`     | Signup       | 회원가입 폼 (이메일 인증 포함)     |
| `/news/:id`   | NewsDetail   | 뉴스 상세 보기, 요약, AI 분석, 업로드 |
| `/bookmark`   | Bookmark     | 북마크한 뉴스 목록 조회 (로그인 필요) |



## 5. 컴포넌트

### 5.1 공통 컴포넌트
- **Navbar**  
  상단 네비게이션 바. 로그인 여부에 따라 메뉴 변경. 로그인, 로그아웃, 즐겨찾기, 회원가입 등 처리

### 5.2 뉴스 및 카테고리 관련 컴포넌트
- **CategoryFilter**  
  기업 카테고리 버튼 목록 렌더링. 선택 시 카테고리 필터링 적용
- **NewsList**  
  기업별 뉴스 리스트 렌더링. 북마크 버튼 포함. 뉴스 클릭 시 상세 페이지로 이동
- **Pagination**  
  뉴스 개수에 따른 페이지네이션 렌더링
- **PublishDate**  
  뉴스 출간일 포맷팅 및 표시 (예: `2025년 7월 10일`)
- **ViewToggle**  
  뉴스 상세 페이지에서 전체 보기 / 요약 보기 버튼 전환

### 5.3 AI 분석 및 채팅 컴포넌트
- **ChatBox**  
  사용자가 질문을 입력하고 AI 응답을 받는 인터페이스. 대화 기록 및 역할(사용자/AI)에 따라 시각적 구분

### 5.4 파일 업로드 컴포넌트
- **FileUploadArea**  
  PDF, TXT 파일 업로드 지원. 다중 선택 및 드래그앤드롭 처리. 업로드 후 텍스트 추출 결과를 상위 컴포넌트로 전달



## 6. 상태 관리

전역 상태 관리를 위해 Zustand를 사용합니다.  

###  Zustand Store 구조

```js
// userStore.js
{
  user: { name, email } | null,         // 로그인한 사용자 정보
  token: string | null,                 // JWT 액세스 토큰
  setUser(userInfo),                    // 사용자 정보 설정 및 localStorage 저장
  setToken(token),                      // 토큰 설정 및 localStorage 저장
  clearAuth(),                          // 사용자/토큰 초기화 및 localStorage 제거
}
```
```js
// bookmarkStore.js
{
  bookmarks: [],                        // 북마크된 뉴스 목록 (로컬스토리지에서 초기화)
  toggleBookmark(news),                // 북마크 추가/제거 및 localStorage 갱신
}
```


## 7. API 연동

- **axiosInstance**: `VITE_API_URL`을 baseURL로 사용하며, 모든 API 요청의 공통 설정을 담당한다.

---

### 인증 관련 API

- `signUp(formData)` : 회원가입 요청
- `signIn(loginData)` : 로그인 및 accessToken 발급
- `requestEmailVerification(email)` : 이메일 인증 코드 전송
- `verifyEmailCode({ email, code })` : 인증 코드 검증
- `refreshToken()` : accessToken 재발급

---

### 뉴스 관련 API

- `fetchCompanies()` : 기업 카테고리 목록 조회
- `fetchNewsTitles()` : 전체 뉴스 제목 목록 조회
- `fetchNewsByCompany(company)` : 선택된 기업의 뉴스 목록 조회
- `fetchNewsDetail(id)` : 뉴스 상세 정보 조회

---

### 파일 및 요약 관련 API

- `uploadFiles(files)` : 문서 파일(PDF/TXT) 업로드 및 텍스트 추출
- `fetchNewsSummary(newsId)` : 뉴스 기사에 대한 요약 요청 (AI 기반)


## 8. 주요 기능

- **기업별 뉴스 탐색**  
  기업 카테고리 버튼을 통해 해당 기업 관련 뉴스 목록을 필터링해서 조회할 수 있습니다.

- **뉴스 상세 보기 및 요약 토글**  
  뉴스 전체 본문과 AI 기반 요약본을 버튼으로 전환하며 열람할 수 있습니다.

- **즐겨찾기(북마크)**  
  로그인한 사용자는 뉴스에 즐겨찾기를 등록하거나 해제할 수 있으며, 북마크 목록은 `/bookmark` 페이지에서 확인할 수 있습니다.

- **회원가입 및 로그인**  
  이메일과 비밀번호를 입력하여 회원가입 및 로그인할 수 있으며, 이메일 인증 기능도 포함되어 있습니다.

- **이메일 인증 기능**  
  회원가입 시 인증 코드를 이메일로 전송하고, 사용자가 인증 코드를 입력하여 본인 인증을 완료합니다.

- **PDF/TXT 문서 업로드**  
  뉴스와 연관된 문서를 업로드(PDF, TXT)하고, 텍스트를 추출하여 AI 분석에 활용할 수 있습니다.

- **AI 분석 기능 (Chat)**  
  업로드한 문서와 뉴스 내용을 기반으로 사용자의 질문에 AI가 분석 결과를 자연어로 답변합니다.

- **반응형 UI 및 UX 개선**  
  Tailwind CSS 기반으로 모바일/데스크탑에서도 잘 보이도록 반응형 레이아웃을 적용했습니다.

- **로컬스토리지 기반 상태 지속성**  
  로그인 정보와 북마크 상태는 페이지 새로고침 후에도 유지됩니다.



## 9. 빌드 및 배포

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 10. Docker 설정

```dockerfile
# --- 빌드 스테이지 ---
FROM node:22.16-alpine AS build

WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app

# API 주소 환경 변수 주입
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && npm run build

# --- 배포 스테이지 ---
FROM nginx:latest

# 기본 설정 제거 및 커스텀 설정 적용
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```


## 11. docker-compose 설정

```yaml
version: '3.8'

services:
  frontend:
    image: hanmg412/prj3:fclient0.4
    container_name: react-client
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: always

networks:
  default:
    name: shared-network
    external: true
```

## 12. Nginx 설정

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  error_page 500 502 503 504 /50x.html;

  location = /50x.html {
    root /usr/share/nginx/html;
  }
}
```

## 13. GitHub Actions (자동 배포)

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ "main" ]

env:
  DOCKER_IMAGE: prj3
  DOCKER_TAG: fclient0.4

jobs:
  Docker:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          no-cache: true
          tags: ${{ secrets.DOCKER_USERNAME }}/prj3:${{ env.DOCKER_TAG }}
          build-args: |
            VITE_API_URL=${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/already-front
            git pull origin main
            docker-compose pull
            docker-compose down
            docker-compose up -d
```
