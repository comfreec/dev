import os
import subprocess
import shutil
import datetime
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

class SimpleGitHubBackup:
    def __init__(self):
        self.backup_folder = None
        self.github_repo = "https://github.com/comfreec/dev.git"
        self.commit_message = "자동 백업"
        
        self.setup_gui()
    
    def setup_gui(self):
        """GUI 설정"""
        self.root = tk.Tk()
        self.root.title("GitHub 백업 프로그램")
        self.root.geometry("500x400")
        self.root.resizable(False, False)
        
        # 메인 프레임
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 제목
        title_label = ttk.Label(main_frame, text="GitHub 자동 백업", font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 20))
        
        # GitHub 저장소 URL
        repo_frame = ttk.Frame(main_frame)
        repo_frame.pack(fill=tk.X, pady=10)
        
        ttk.Label(repo_frame, text="GitHub 저장소:").pack(anchor=tk.W)
        self.repo_entry = ttk.Entry(repo_frame, width=50)
        self.repo_entry.insert(0, self.github_repo)
        self.repo_entry.pack(fill=tk.X, pady=5)
        
        # 커밋 메시지
        commit_frame = ttk.Frame(main_frame)
        commit_frame.pack(fill=tk.X, pady=10)
        
        ttk.Label(commit_frame, text="커밋 메시지:").pack(anchor=tk.W)
        self.commit_entry = ttk.Entry(commit_frame, width=50)
        self.commit_entry.insert(0, self.commit_message)
        self.commit_entry.pack(fill=tk.X, pady=5)
        
        # 폴더 선택
        folder_frame = ttk.Frame(main_frame)
        folder_frame.pack(fill=tk.X, pady=20)
        
        self.btn_select = ttk.Button(folder_frame, text="📂 폴더 선택", command=self.select_folder)
        self.btn_select.pack(pady=5)
        
        self.lbl_folder = ttk.Label(folder_frame, text="선택된 폴더 없음", foreground="gray")
        self.lbl_folder.pack(pady=5)
        
        # 백업 버튼
        self.btn_backup = ttk.Button(main_frame, text="☁️ GitHub로 백업", command=self.backup_to_github)
        self.btn_backup.pack(pady=20)
        
        # 상태 표시
        self.lbl_status = ttk.Label(main_frame, text="대기 중...", foreground="blue")
        self.lbl_status.pack(pady=10)
        
        # 진행바
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        
        # 창을 화면 중앙에 위치
        self.center_window()
    
    def center_window(self):
        """창을 화면 중앙에 위치시킴"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')
    
    def select_folder(self):
        """폴더 선택"""
        folder = filedialog.askdirectory(title="백업할 폴더 선택")
        if folder:
            self.backup_folder = folder
            self.lbl_folder.config(text=f"선택됨: {os.path.basename(folder)}", foreground="green")
    
    def run_command(self, command, cwd=None):
        """명령어 실행"""
        try:
            result = subprocess.run(command, cwd=cwd, shell=True,
                                  capture_output=True, text=True, encoding='utf-8')
            if result.returncode != 0:
                raise Exception(f"명령어 실패: {result.stderr}")
            return result.stdout
        except Exception as e:
            raise Exception(f"명령어 실행 오류: {e}")
    
    def update_status(self, message):
        """상태 메시지 업데이트"""
        self.lbl_status.config(text=message)
        self.root.update()
    
    def backup_to_github(self):
        """GitHub 백업 실행"""
        if not self.backup_folder:
            messagebox.showwarning("경고", "먼저 폴더를 선택하세요!")
            return
        
        # UI 비활성화
        self.btn_backup.config(state=tk.DISABLED)
        self.btn_select.config(state=tk.DISABLED)
        self.progress.pack(fill=tk.X, pady=10)
        self.progress.start()
        
        try:
            # 설정 가져오기
            self.github_repo = self.repo_entry.get()
            self.commit_message = self.commit_entry.get()
            
            # Git 설치 확인
            try:
                self.run_command("git --version")
            except:
                raise Exception("Git이 설치되어 있지 않습니다.")
            
            self.update_status("백업 폴더 생성 중...")
            
            # 백업 폴더 생성
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            parent_dir = os.path.dirname(self.backup_folder)
            folder_name = os.path.basename(self.backup_folder)
            new_backup_path = os.path.join(parent_dir, f"{folder_name}_{timestamp}")
            
            # 기존 폴더 삭제
            if os.path.exists(new_backup_path):
                shutil.rmtree(new_backup_path)
            
            # 폴더 생성
            os.makedirs(new_backup_path)
            
            self.update_status("파일 복사 중...")
            
            # 파일 복사 (폴더 구조 유지)
            backup_subfolder = os.path.join(new_backup_path, folder_name)
            shutil.copytree(self.backup_folder, backup_subfolder)
            
            self.update_status("Git 초기화 중...")
            
            # Git 초기화
            self.run_command("git init", cwd=new_backup_path)
            self.run_command(f"git remote add origin {self.github_repo}", cwd=new_backup_path)
            
            self.update_status("변경사항 커밋 중...")
            
            # 커밋
            self.run_command("git add .", cwd=new_backup_path)
            self.run_command(f'git commit -m "{self.commit_message}"', cwd=new_backup_path)
            
            self.update_status("GitHub에 업로드 중...")
            
            # 푸시
            self.run_command("git branch -M main", cwd=new_backup_path)
            self.run_command("git push -u origin main --force", cwd=new_backup_path)
            
            # 성공
            self.update_status("백업 완료!")
            messagebox.showinfo("성공", f"GitHub로 백업 완료!\n\n백업 폴더: {new_backup_path}")
            
        except Exception as e:
            error_msg = f"백업 실패: {e}"
            self.update_status("백업 실패")
            messagebox.showerror("에러", error_msg)
            print(f"오류 상세: {e}")
        
        finally:
            # UI 복원
            self.progress.stop()
            self.progress.pack_forget()
            self.btn_backup.config(state=tk.NORMAL)
            self.btn_select.config(state=tk.NORMAL)
            self.update_status("대기 중...")
    
    def run(self):
        """앱 실행"""
        try:
            self.root.mainloop()
        except Exception as e:
            print(f"GUI 오류: {e}")
            input("엔터 키를 눌러 종료하세요...")

if __name__ == "__main__":
    try:
        app = SimpleGitHubBackup()
        app.run()
    except Exception as e:
        print(f"프로그램 시작 오류: {e}")
        import traceback
        traceback.print_exc()
        input("엔터 키를 눌러 종료하세요...")
