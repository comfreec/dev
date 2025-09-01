import os
import subprocess
import shutil
import datetime
import tkinter as tk
from tkinter import filedialog, messagebox
import zipfile
import tempfile

# GitHub 원격 저장소 URL
GITHUB_REPO = "https://github.com/comfreec/dev.git"

# Git 커밋 메시지 기본값
COMMIT_MESSAGE = "자동 백업"

# 선택된 폴더 경로
backup_folder = None
repo_path = None

def select_folder():
    global backup_folder
    backup_folder = filedialog.askdirectory()
    if backup_folder:
        lbl_folder.config(text=f"선택된 폴더: {backup_folder}")

def run_command(command, cwd=None):
    try:
        result = subprocess.run(command, cwd=cwd, shell=True,
                                capture_output=True, text=True, encoding='utf-8')
        if result.returncode != 0:
            print(f"명령 실행 오류: {command}")
            print(f"에러: {result.stderr}")
            return None
        return result.stdout
    except Exception as e:
        messagebox.showerror("에러", f"명령 실행 실패: {e}")
        return None

def create_zip_file(source_folder, zip_path):
    """폴더를 ZIP 파일로 압축"""
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_folder):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_folder)
                zipf.write(file_path, arcname)
    print(f"압축 완료: {zip_path}")

def setup_repo():
    """로컬 저장소 설정"""
    global repo_path
    repo_path = os.path.join(os.path.expanduser("~"), "github_backup_temp")
    
    # 기존 폴더가 있으면 삭제
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)
    
    # 저장소 클론
    print(f"저장소 클론: {GITHUB_REPO}")
    result = run_command(f"git clone {GITHUB_REPO} \"{repo_path}\"")
    if result is None:
        messagebox.showerror("에러", "GitHub 저장소 클론에 실패했습니다.\n저장소가 존재하는지 확인해주세요.")
        return False
    
    return True

def backup_to_github():
    global backup_folder, repo_path
    if not backup_folder:
        messagebox.showwarning("경고", "먼저 폴더를 선택하세요!")
        return

    try:
        # 진행 상태 표시
        lbl_status.config(text="백업 진행 중...")
        root.update()

        # 저장소 설정
        if not setup_repo():
            return

        # 날짜+시간 기반 백업 파일명 생성
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = os.path.basename(backup_folder)
        backup_filename = f"{folder_name}_{timestamp}.zip"
        backup_file_path = os.path.join(repo_path, backup_filename)

        # 폴더를 ZIP으로 압축
        lbl_status.config(text="폴더 압축 중...")
        root.update()
        create_zip_file(backup_folder, backup_file_path)

        # Git에 추가 및 커밋
        lbl_status.config(text="Git 커밋 중...")
        root.update()
        
        run_command("git add .", cwd=repo_path)
        run_command(f"git commit -m \"{COMMIT_MESSAGE} - {backup_filename}\"", cwd=repo_path)

        # 원격 푸시
        lbl_status.config(text="GitHub에 업로드 중...")
        root.update()
        
        push_result = run_command("git push origin main", cwd=repo_path)
        if push_result is None:
            # main 브랜치가 아닐 수도 있으니 master로 시도
            push_result = run_command("git push origin master", cwd=repo_path)
            if push_result is None:
                messagebox.showerror("에러", "GitHub 푸시에 실패했습니다.\nGit 인증 설정을 확인해주세요.")
                return

        # 임시 폴더 정리
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)

        lbl_status.config(text="백업 완료!")
        messagebox.showinfo("성공", f"GitHub로 백업 완료!\n백업 파일: {backup_filename}\n저장소: comfreec/dev")

    except Exception as e:
        lbl_status.config(text="백업 실패!")
        messagebox.showerror("에러", f"백업 중 오류가 발생했습니다:\n{str(e)}")
        # 임시 폴더 정리
        if repo_path and os.path.exists(repo_path):
            shutil.rmtree(repo_path)

# GUI 생성
root = tk.Tk()
root.title("GitHub 자동 백업 프로그램")
root.geometry("500x300")

# 제목
title_label = tk.Label(root, text="GitHub 폴더 백업 (comfreec/dev)", font=("Arial", 14, "bold"))
title_label.pack(pady=10)

# 폴더 선택
btn_select = tk.Button(root, text="📂 폴더 선택", command=select_folder, font=("Arial", 10))
btn_select.pack(pady=10)

lbl_folder = tk.Label(root, text="선택된 폴더 없음", wraplength=450)
lbl_folder.pack(pady=5)

# 백업 버튼
btn_backup = tk.Button(root, text="☁️ GitHub로 백업", command=backup_to_github, font=("Arial", 12), bg="lightblue")
btn_backup.pack(pady=20)

# 상태 표시
lbl_status = tk.Label(root, text="대기 중...", fg="blue")
lbl_status.pack(pady=10)

# 사용법 안내
info_text = """사용법:
1. '폴더 선택' 버튼을 클릭하여 백업할 폴더 선택
2. 'GitHub로 백업' 버튼을 클릭하여 백업 시작
3. 백업 파일은 '폴더명_날짜_시간.zip' 형식으로 저장됩니다

주의: Git 인증 설정이 되어 있어야 합니다."""

info_label = tk.Label(root, text=info_text, justify=tk.LEFT, font=("Arial", 9))
info_label.pack(pady=10)

root.mainloop()