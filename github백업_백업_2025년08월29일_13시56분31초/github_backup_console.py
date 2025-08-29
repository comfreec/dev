import os
import subprocess
import shutil
import datetime

def run_command(command, cwd=None):
    """명령어 실행"""
    try:
        result = subprocess.run(command, cwd=cwd, shell=True,
                              capture_output=True, text=True, encoding='utf-8')
        if result.returncode != 0:
            raise Exception(f"명령어 실패: {result.stderr}")
        return result.stdout
    except Exception as e:
        raise Exception(f"명령어 실행 오류: {e}")

def backup_to_github():
    """GitHub 백업 실행"""
    print("=" * 50)
    print("GitHub 자동 백업 프로그램")
    print("=" * 50)
    
    # 설정
    github_repo = "https://github.com/comfreec/dev.git"
    commit_message = "자동 백업"
    
    try:
        # Git 설치 확인
        print("1. Git 설치 확인 중...")
        run_command("git --version")
        print("   ✓ Git이 설치되어 있습니다.")
        
        # 백업할 폴더 입력
        print("\n2. 백업할 폴더 경로를 입력하세요:")
        backup_folder = input("   폴더 경로: ").strip()
        
        if not backup_folder or not os.path.exists(backup_folder):
            print("   ❌ 유효하지 않은 폴더 경로입니다.")
            return
        
        print(f"   ✓ 선택된 폴더: {backup_folder}")
        
        # 백업 폴더 생성
        print("\n3. 백업 폴더 생성 중...")
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        parent_dir = os.path.dirname(backup_folder)
        folder_name = os.path.basename(backup_folder)
        new_backup_path = os.path.join(parent_dir, f"{folder_name}_{timestamp}")
        
        # 기존 폴더 삭제
        if os.path.exists(new_backup_path):
            shutil.rmtree(new_backup_path)
        
        # 폴더 생성
        os.makedirs(new_backup_path)
        print(f"   ✓ 백업 폴더 생성: {new_backup_path}")
        
        # 파일 복사
        print("\n4. 파일 복사 중...")
        backup_subfolder = os.path.join(new_backup_path, folder_name)
        shutil.copytree(backup_folder, backup_subfolder)
        print(f"   ✓ 파일 복사 완료: {backup_subfolder}")
        
        # Git 초기화
        print("\n5. Git 초기화 중...")
        run_command("git init", cwd=new_backup_path)
        run_command(f"git remote add origin {github_repo}", cwd=new_backup_path)
        print("   ✓ Git 초기화 완료")
        
        # 커밋
        print("\n6. 변경사항 커밋 중...")
        run_command("git add .", cwd=new_backup_path)
        run_command(f'git commit -m "{commit_message}"', cwd=new_backup_path)
        print("   ✓ 커밋 완료")
        
        # 푸시
        print("\n7. GitHub에 업로드 중...")
        run_command("git branch -M main", cwd=new_backup_path)
        run_command("git push -u origin main --force", cwd=new_backup_path)
        print("   ✓ GitHub 업로드 완료")
        
        # 성공 메시지
        print("\n" + "=" * 50)
        print("🎉 백업 완료!")
        print(f"📁 백업 폴더: {new_backup_path}")
        print(f"🌐 GitHub 저장소: {github_repo}")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ 백업 실패: {e}")
        print("상세 오류 정보:")
        import traceback
        traceback.print_exc()

def main():
    """메인 함수"""
    while True:
        print("\n" + "=" * 50)
        print("GitHub 백업 프로그램")
        print("=" * 50)
        print("1. 백업 실행")
        print("2. 종료")
        
        choice = input("\n선택하세요 (1-2): ").strip()
        
        if choice == "1":
            backup_to_github()
        elif choice == "2":
            print("프로그램을 종료합니다.")
            break
        else:
            print("잘못된 선택입니다. 다시 선택해주세요.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n프로그램이 중단되었습니다.")
    except Exception as e:
        print(f"\n프로그램 오류: {e}")
        import traceback
        traceback.print_exc()
    finally:
        input("\n엔터 키를 눌러 종료하세요...")
