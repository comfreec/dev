import os
import shutil
import subprocess
import tempfile
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from datetime import datetime
import requests

# ================== 사용자 설정 ==================
# GitHub 저장소 정보
GITHUB_REPO_URL = "https://github.com/comfreec/dev.git"  # comfreec/dev 저장소
GITHUB_OWNER = "comfreec"                                # GitHub 사용자명
GITHUB_REPO = "dev"                                       # 저장소명
GITHUB_BRANCH = "main"                                    # 푸시/다운로드 브랜치
GITHUB_TOKEN = ""                                         # 비공개 저장소면 PAT 입력 (공개면 빈 문자열)

LOCAL_BACKUP_ROOT = r"C:\backup"                          # 로컬 백업 루트
# ================================================

# 공통 헤더
def gh_headers():
    return {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

# UI 업데이트 헬퍼
def set_status(text):
    status_var.set(text)
    root.update_idletasks()

def set_progress(pct):
    progress_var.set(int(max(0, min(100, pct))))  # 괄호 오류 수정
    root.update_idletasks()

# 파일 개수 세기 (진행률 계산용)
def count_files(root_dir):
    total = 0
    for base, _, files in os.walk(root_dir):
        total += len(files)
    return total

# --------- 백업(로컬 복사 + GitHub 푸시) ----------
def copy_with_progress(src, dst):
    os.makedirs(dst, exist_ok=True)
    files = []
    for base, _, fs in os.walk(src):
        for f in fs:
            files.append(os.path.join(base, f))
    total = len(files) if files else 1
    done = 0

    for fpath in files:
        rel = os.path.relpath(fpath, src)
        target = os.path.join(dst, rel)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copy2(fpath, target)
        done += 1
        set_status(f"로컬 백업 중... {done}/{total} 파일")
        set_progress(10 + (done / total) * 60)  # 10%~70% 구간을 로컬 복사에 할당

def git_push_backup(local_backup_path, backup_folder_name):
    """
    로컬 dev에 남기지 않기 위해 임시 폴더에 shallow clone 후 커밋/푸시, 임시 폴더 삭제
    """
    set_status("GitHub 업로드 준비(임시 클론)...")
    with tempfile.TemporaryDirectory() as tmpdir:
        # 인증 포함 URL (토큰이 있을 때만)
        remote = GITHUB_REPO_URL
        if GITHUB_TOKEN and remote.startswith("https://"):
            remote = remote.replace(
                "https://", f"https://{GITHUB_TOKEN}@"
            )

        # shallow clone of specific branch
        cmd = ["git", "clone", "--depth", "1", "-b", GITHUB_BRANCH, remote, tmpdir]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"git clone 실패:\n{result.stderr}")

        # 백업 폴더를 임시 클론 루트에 복사
        dst_in_repo = os.path.join(tmpdir, os.path.basename(local_backup_path))
        shutil.copytree(local_backup_path, dst_in_repo)

        set_status("변경사항 커밋 중...")
        subprocess.run(["git", "add", "."], cwd=tmpdir, check=True)
        subprocess.run(["git", "commit", "-m", f"Backup {backup_folder_name}"], cwd=tmpdir, check=True)

        set_status("원격 푸시 중...")
        subprocess.run(["git", "push", "origin", GITHUB_BRANCH], cwd=tmpdir, check=True)

def do_backup():
    # 폴더 선택
    src = filedialog.askdirectory(title="백업할 폴더 선택")
    if not src:
        return

    try:
        folder_name = os.path.basename(src.rstrip("/\\"))
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_folder_name = f"{folder_name}_{timestamp}"
        local_backup_path = os.path.join(LOCAL_BACKUP_ROOT, backup_folder_name)

        set_progress(0)
        set_status("로컬 백업 준비...")
        os.makedirs(LOCAL_BACKUP_ROOT, exist_ok=True)

        # 로컬 백업 (진행률 10~70%)
        copy_with_progress(src, local_backup_path)

        # GitHub 푸시 (진행률 70~100%)
        set_status("GitHub로 업로드 중...")
        set_progress(80)
        git_push_backup(local_backup_path, backup_folder_name)

        set_progress(100)
        set_status("백업 완료")
        messagebox.showinfo("성공", f"✅ 백업 완료!\n로컬: {local_backup_path}\nGitHub({GITHUB_BRANCH}) 업로드 완료")

    except Exception as e:
        messagebox.showerror("오류", f"백업 실패: {e}")
        set_status("백업 실패")
        set_progress(0)

# --------- 복원(선택 폴더 전체 내려받기) ----------
def list_top_level_dirs():
    """
    저장소 최상위 디렉토리 목록 반환
    """
    api_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents?ref={GITHUB_BRANCH}"
    r = requests.get(api_url, headers=gh_headers())
    r.raise_for_status()
    items = r.json()
    return [it["name"] for it in items if it["type"] == "dir"]

def download_folder_recursive(repo_path, save_to, progress_range=(0, 100)):
    """
    GitHub API로 repo_path(디렉토리)를 재귀적으로 다운로드.
    progress_range: (start_pct, end_pct)
    """
    start, end = progress_range
    files_to_get = []

    # 먼저 전체 파일 목록(재귀) 수집
    def walk(path):
        url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}?ref={GITHUB_BRANCH}"
        r = requests.get(url, headers=gh_headers())
        r.raise_for_status()
        items = r.json()
        for it in items:
            if it["type"] == "file":
                files_to_get.append((it["path"], it["download_url"]))
            elif it["type"] == "dir":
                walk(it["path"])

    set_status("파일 목록 수집 중...")
    walk(repo_path)
    total = len(files_to_get) if files_to_get else 1

    # 다운로드
    done = 0
    for rel_path, dl_url in files_to_get:
        out_path = os.path.join(save_to, os.path.relpath(rel_path, repo_path))
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        resp = requests.get(dl_url, headers=gh_headers())
        resp.raise_for_status()
        with open(out_path, "wb") as f:
            f.write(resp.content)
        done += 1
        pct = start + (done / total) * (end - start)
        set_status(f"다운로드 중... {done}/{total} 파일")
        set_progress(pct)

def do_restore():
    try:
        # 최상위 폴더 목록 가져오기
        set_status("GitHub 폴더 목록 불러오는 중...")
        dirs = list_top_level_dirs()
        if not dirs:
            messagebox.showinfo("알림", "저장소에 폴더가 없습니다.")
            return

        # 선택 창
        win = tk.Toplevel(root)
        win.title("다운로드할 폴더 선택")
        win.geometry("360x420")

        tk.Label(win, text="다운로드할 폴더를 선택하세요:").pack(pady=8)
        lb = tk.Listbox(win, height=15)
        for d in dirs:
            lb.insert(tk.END, d)
        lb.pack(fill="both", expand=True, padx=10, pady=5)

        def on_download():
            sel = lb.curselection()
            if not sel:
                messagebox.showwarning("경고", "폴더를 선택하세요.")
                return
            folder = lb.get(sel[0])
            target_dir = filedialog.askdirectory(title="저장할 위치 선택")
            if not target_dir:
                return
            save_to = os.path.join(target_dir, folder)
            os.makedirs(save_to, exist_ok=True)

            win.destroy()
            set_progress(0)
            set_status("다운로드 준비 중...")

            # 전체 다운로드 (재귀, 진행률 표시)
            download_folder_recursive(folder, save_to, progress_range=(0, 100))

            set_progress(100)
            set_status("다운로드 완료")
            messagebox.showinfo("성공", f"✅ '{folder}' 다운로드 완료!\n경로: {save_to}")

        ttk.Button(win, text="다운로드", command=on_download).pack(pady=10)

    except requests.HTTPError as e:
        messagebox.showerror("오류", f"GitHub API 오류: {e}")
        set_status("다운로드 실패")
    except Exception as e:
        messagebox.showerror("오류", f"다운로드 실패: {e}")
        set_status("다운로드 실패")
        set_progress(0)

# ----------------- GUI -----------------
root = tk.Tk()
root.title("GitHub 백업 & 복원 (comfreec/dev)")
root.geometry("520x260")

title_label = tk.Label(root, text="GitHub 백업 & 복원 (comfreec/dev)", font=("맑은 고딕", 14, "bold"))
title_label.pack(pady=8)

btn_frame = tk.Frame(root)
btn_frame.pack(pady=4)

backup_btn = ttk.Button(btn_frame, text="📦 폴더 백업 → GitHub(main)", command=do_backup)
backup_btn.grid(row=0, column=0, padx=6, pady=6)

restore_btn = ttk.Button(btn_frame, text="⬇ GitHub에서 폴더 선택 다운로드", command=do_restore)
restore_btn.grid(row=0, column=1, padx=6, pady=6)

progress_var = tk.IntVar(value=0)
progress = ttk.Progressbar(root, maximum=100, length=440, variable=progress_var)
progress.pack(pady=10)

status_var = tk.StringVar(value="대기 중")
status_label = tk.Label(root, textvariable=status_var)
status_label.pack()

root.mainloop()