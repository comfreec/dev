# GitHub 자동 백업 프로그램

로컬 폴더를 GitHub 저장소에 자동으로 백업하는 Python GUI 프로그램입니다.

## 주요 기능

- 📂 **폴더 선택**: 백업할 폴더를 쉽게 선택
- ⚙️ **설정 관리**: GitHub 저장소 URL과 커밋 메시지를 설정 파일로 관리
- 📊 **진행 상황 표시**: 백업 진행 상황을 실시간으로 확인
- 📋 **백업 히스토리**: 이전 백업 기록을 테이블로 확인
- 🔄 **비동기 처리**: 백업 중에도 UI가 멈추지 않음
- 🛡️ **에러 처리**: 상세한 에러 메시지와 실패 기록

## 설치 방법

### 1. Python 설치
Python 3.7 이상이 필요합니다.
- [Python 공식 사이트](https://www.python.org/downloads/)에서 다운로드

### 2. Git 설치
Git이 시스템에 설치되어 있어야 합니다.
- [Git 공식 사이트](https://git-scm.com/downloads)에서 다운로드

### 3. 프로그램 실행
```bash
python github_backup.py
```

## 사용 방법

### 1. GitHub 저장소 준비
- GitHub에서 새 저장소를 생성하거나 기존 저장소 사용
- 저장소 URL을 복사 (예: `https://github.com/username/repo.git`)

### 2. 프로그램 설정
1. **GitHub 저장소 URL** 입력란에 저장소 URL 입력
2. **커밋 메시지** 입력란에 원하는 커밋 메시지 입력
3. 설정은 자동으로 `backup_config.json` 파일에 저장됩니다

### 3. 백업 실행
1. **📂 폴더 선택** 버튼을 클릭하여 백업할 폴더 선택
2. **☁️ GitHub로 백업** 버튼을 클릭하여 백업 시작
3. 진행 상황을 확인하고 완료 메시지 대기

## 백업 과정

1. **폴더 복사**: 선택한 폴더를 타임스탬프가 포함된 새 폴더로 복사
2. **Git 초기화**: 새 폴더에서 Git 저장소 초기화
3. **원격 저장소 연결**: GitHub 저장소를 원격으로 추가
4. **변경사항 커밋**: 모든 파일을 스테이징하고 커밋
5. **GitHub 업로드**: 변경사항을 GitHub에 푸시

## 파일 구조

```
프로젝트 폴더/
├── github_backup.py      # 메인 프로그램
├── backup_config.json    # 설정 파일 (자동 생성)
└── README.md            # 이 파일
```

## 설정 파일 (backup_config.json)

```json
{
  "github_repo": "https://github.com/USERNAME/REPO.git",
  "commit_message": "자동 백업",
  "backup_history": [
    {
      "date": "2024-01-01 12:00:00",
      "folder": "my_folder_20240101_120000",
      "status": "성공"
    }
  ]
}
```

## 주의사항

1. **Git 인증**: GitHub에 푸시하려면 Git 인증이 필요합니다
   - Personal Access Token 사용 권장
   - 또는 SSH 키 설정

2. **저장소 권한**: GitHub 저장소에 쓰기 권한이 있어야 합니다

3. **네트워크 연결**: 인터넷 연결이 필요합니다

4. **디스크 공간**: 백업 폴더가 복사되므로 충분한 디스크 공간이 필요합니다

## 문제 해결

### Git 인증 오류
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Personal Access Token 설정
1. GitHub → Settings → Developer settings → Personal access tokens
2. 새 토큰 생성 (repo 권한 필요)
3. 토큰을 비밀번호로 사용

### 권한 오류
- GitHub 저장소가 private인 경우 적절한 권한이 있는지 확인
- 저장소 URL이 올바른지 확인

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여

버그 리포트나 기능 제안은 언제든 환영합니다!
