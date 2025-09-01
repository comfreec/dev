# GitHub 폴더 백업 프로그램

원하는 폴더를 선택하여 GitHub 저장소에 자동으로 백업하는 GUI 프로그램입니다.

## 기능

- 폴더 선택 GUI 인터페이스
- 선택한 폴더를 ZIP 파일로 압축
- GitHub API를 통한 자동 업로드
- 백업 파일명에 원본 폴더명 + 날짜/시간 포함
- 백업 진행 상황 실시간 로그

## 사전 준비

### 1. GitHub Token 발급

1. GitHub에 로그인
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token" 클릭
4. 다음 권한 선택:
   - `repo` (Full control of private repositories)
5. 생성된 토큰을 복사하여 보관

### 2. 백업 저장소 준비

- GitHub에 `comfreec/dev` 저장소가 존재해야 합니다
- 저장소가 없다면 미리 생성해주세요

### 3. 필요 라이브러리 설치

```bash
pip install -r requirements.txt
```

## 사용법

### 1. 프로그램 실행

```bash
python github_backup.py
```

### 2. GitHub Token 입력

- 프로그램 상단의 "GitHub Token" 필드에 발급받은 토큰을 입력

### 3. 폴더 선택

- "폴더 선택" 버튼을 클릭하여 백업할 폴더 선택

### 4. 백업 시작

- "백업 시작" 버튼을 클릭하여 백업 실행

## 백업 파일명 규칙

`{원본폴더명}_{날짜}_{시간}.zip`

예시: `MyProject_20240829_143022.zip`

## 주의사항

- GitHub Token은 안전하게 보관하세요
- 대용량 폴더 백업 시 시간이 오래 걸릴 수 있습니다
- GitHub 파일 크기 제한 (100MB)을 초과하는 폴더는 백업할 수 없습니다

## 문제 해결

### Token 오류
- GitHub Token이 올바른지 확인
- Token에 적절한 권한이 있는지 확인

### 업로드 실패
- 인터넷 연결 상태 확인
- 저장소 접근 권한 확인
- 파일 크기가 GitHub 제한을 초과하지 않는지 확인