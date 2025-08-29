import os
import subprocess
import shutil
import datetime
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import sys

class GitHubBackupGUI:
    def __init__(self):
        self.backup_folder = None
        self.github_repo = "https://github.com/comfreec/dev.git"
        self.commit_message = "자동 백업"
        
        # 메인 윈도우 생성
        self.root = tk.Tk()
        self.root.title("GitHub 자동 백업 프로그램")
        self.root.geometry("600x500")
        self.root.resizable(True, True)
        
        # 아이콘 설정 (있는 경우)
        try:
            self.root.iconbitmap("icon.ico")
        except:
            pass
        
        self.setup_gui()
        self.center_window()
    
    def center_window(self):
        """창을 화면 중앙에 위치시킴"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')
    
    def setup_gui(self):
        """GUI 설정"""
        # 메인 프레임
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 제목
        title_label = ttk.Label(main_frame, text="GitHub 자동 백업 프로그램", 
                               font=("Arial", 18, "bold"))
        title_label.pack(pady=(0, 20))
        
        # 설정 프레임
        settings_frame = ttk.LabelFrame(main_frame, text="설정", padding="15")
        settings_frame.pack(fill=tk.X, pady=(0, 15))
        
        # GitHub 저장소 URL
        ttk.Label(settings_frame, text="GitHub 저장소 URL:").pack(anchor=tk.W)
        self.repo_entry = ttk.Entry(settings_frame, width=60, font=("Arial", 10))
        self.repo_entry.insert(0, self.github_repo)
        self.repo_entry.pack(fill=tk.X, pady=(5, 10))
        
        # 커밋 메시지
        ttk.Label(settings_frame, text="커밋 메시지:").pack(anchor=tk.W)
        self.commit_entry = ttk.Entry(settings_frame, width=60, font=("Arial", 10))
        self.commit_entry.insert(0, self.commit_message)
        self.commit_entry.pack(fill=tk.X, pady=(5, 10))
        
        # 폴더 선택 프레임
        folder_frame = ttk.LabelFrame(main_frame, text="백업 폴더", padding="15")
        folder_frame.pack(fill=tk.X, pady=(0, 15))
        
        # 폴더 선택 버튼
        self.btn_select = ttk.Button(folder_frame, text="📂 폴더 선택", 
                                    command=self.select_folder, style="Accent.TButton")
        self.btn_select.pack(pady=5)
        
        # 선택된 폴더 표시
        self.lbl_folder = ttk.Label(folder_frame, text="선택된 폴더 없음", 
                                   foreground="gray", font=("Arial", 9))
        self.lbl_folder.pack(pady=5)
        
        # 백업 버튼
        self.btn_backup = ttk.Button(main_frame, text="☁️ GitHub로 백업", 
                                    command=self.start_backup, style="Accent.TButton")
        self.btn_backup.pack(pady=20)
        
        # 상태 표시 프레임
        status_frame = ttk.LabelFrame(main_frame, text="상태", padding="15")
        status_frame.pack(fill=tk.X, pady=(0, 15))
        
        # 상태 메시지
        self.lbl_status = ttk.Label(status_frame, text="대기 중...", 
                                   foreground="blue", font=("Arial", 10))
        self.lbl_status.pack(pady=5)
        
        # 진행바
        self.progress = ttk.Progressbar(status_frame, mode='determinate', maximum=100)
        self.progress.pack(fill=tk.X, pady=5)
        
        # 로그 텍스트
        log_frame = ttk.LabelFrame(main_frame, text="로그", padding="10")
        log_frame.pack(fill=tk.BOTH, expand=True)
        
        # 스크롤바가 있는 텍스트 위젯
        self.log_text = tk.Text(log_frame, height=8, font=("Consolas", 9))
        scrollbar = ttk.Scrollbar(log_frame, orient=tk.VERTICAL, command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        
        self.log_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # 초기 로그 메시지
        self.log("프로그램이 시작되었습니다.")
        self.log(f"GitHub 저장소: {self.github_repo}")
    
    def log(self, message):
        """로그 메시지 추가"""
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        self.root.update()
    
    def select_folder(self):
        """폴더 선택"""
        folder = filedialog.askdirectory(title="백업할 폴더 선택")
        if folder:
            self.backup_folder = folder
            folder_name = os.path.basename(folder)
            self.lbl_folder.config(text=f"선택됨: {folder_name}", foreground="green")
            self.log(f"폴더 선택됨: {folder}")
    
    def run_command(self, command, cwd=None):
        """명령어 실행"""
        try:
            self.log(f"실행: {command}")
            result = subprocess.run(command, cwd=cwd, shell=True,
                                  capture_output=True, text=True, encoding='utf-8')
            if result.returncode != 0:
                raise Exception(f"명령어 실패: {result.stderr}")
            if result.stdout.strip():
                self.log(f"출력: {result.stdout.strip()}")
            return result.stdout
        except Exception as e:
            raise Exception(f"명령어 실행 오류: {e}")
    
    def update_status(self, message, progress=None):
        """상태 메시지 업데이트"""
        self.lbl_status.config(text=message)
        self.log(message)
        if progress is not None:
            self.progress['value'] = progress
        self.root.update()
    
    def copy_files_with_progress(self, src, dst):
        """진행률을 표시하며 파일 복사"""
        # 전체 파일 수 계산
        total_files = 0
        for root, dirs, files in os.walk(src):
            total_files += len(files)
        
        copied_files = 0
        
        # 대상 디렉토리 생성
        if not os.path.exists(dst):
            os.makedirs(dst)
        
        for root, dirs, files in os.walk(src):
            # 현재 디렉토리의 상대 경로
            rel_root = os.path.relpath(root, src)
            dst_root = os.path.join(dst, rel_root) if rel_root != '.' else dst
            
            # 디렉토리 생성
            for d in dirs:
                dst_dir = os.path.join(dst_root, d)
                if not os.path.exists(dst_dir):
                    os.makedirs(dst_dir)
            
            # 파일 복사
            for f in files:
                src_file = os.path.join(root, f)
                dst_file = os.path.join(dst_root, f)
                
                try:
                    shutil.copy2(src_file, dst_file)
                    copied_files += 1
                    progress = (copied_files / total_files) * 100
                    self.update_status(f"파일 복사 중... {copied_files}/{total_files} ({progress:.1f}%)", progress)
                except Exception as e:
                    self.log(f"파일 복사 실패: {src_file} -> {e}")
        
        self.log(f"총 {copied_files}개 파일 복사 완료")
    
    def backup_to_github(self):
        """GitHub 백업 실행"""
        if not self.backup_folder:
            messagebox.showwarning("경고", "먼저 폴더를 선택하세요!")
            return
        
        # UI 비활성화
        self.btn_backup.config(state=tk.DISABLED)
        self.btn_select.config(state=tk.DISABLED)
        self.progress['value'] = 0
        
        try:
            # 설정 가져오기
            self.github_repo = self.repo_entry.get()
            self.commit_message = self.commit_entry.get()
            
            self.log("백업 시작...")
            self.update_status("백업 시작...", 0)
            
            # Git 설치 확인
            try:
                self.run_command("git --version")
                self.update_status("Git 설치 확인 완료", 5)
            except:
                raise Exception("Git이 설치되어 있지 않습니다.")
            
            self.update_status("백업 폴더 생성 중...", 10)
            
            # 백업 폴더 생성 (날짜 포함)
            now = datetime.datetime.now()
            date_str = now.strftime("%Y년%m월%d일")
            time_str = now.strftime("%H시%M분%S초")
            parent_dir = os.path.dirname(self.backup_folder)
            folder_name = os.path.basename(self.backup_folder)
            new_backup_path = os.path.join(parent_dir, f"{folder_name}_{date_str}_{time_str}")
            
            # 폴더 생성 (기존 폴더가 있어도 삭제하지 않음)
            if not os.path.exists(new_backup_path):
                os.makedirs(new_backup_path)
            self.log(f"백업 폴더 생성: {new_backup_path}")
            
            self.update_status("파일 복사 준비 중...", 15)
            
            # 파일 복사 (GitHub용 폴더명으로 변경 - 시간 포함으로 고유화)
            github_folder_name = f"{folder_name}_백업_{date_str}_{time_str}"
            backup_subfolder = os.path.join(new_backup_path, github_folder_name)
            
            # 폴더 복사 (진행률 표시)
            self.copy_files_with_progress(self.backup_folder, backup_subfolder)
            
            # 폴더 권한 설정 (읽기/쓰기/실행 권한)
            self.update_status("파일 권한 설정 중...", 75)
            for root, dirs, files in os.walk(backup_subfolder):
                for d in dirs:
                    dir_path = os.path.join(root, d)
                    try:
                        os.chmod(dir_path, 0o755)  # 폴더 권한 설정
                    except:
                        pass
                for f in files:
                    file_path = os.path.join(root, f)
                    try:
                        os.chmod(file_path, 0o644)  # 파일 권한 설정
                    except:
                        pass
            
            self.log(f"파일 복사 완료: {backup_subfolder}")
            
            self.update_status("Git 초기화 중...", 80)
            
            # Git 초기화
            self.run_command("git init", cwd=new_backup_path)
            self.log("Git 저장소 초기화 완료")
            
            # Git 사용자 설정 (필요한 경우)
            self.update_status("Git 사용자 설정 중...", 82)
            try:
                self.run_command('git config user.name "GitHub Backup"', cwd=new_backup_path)
                self.run_command('git config user.email "backup@github.com"', cwd=new_backup_path)
                self.log("Git 사용자 설정 완료")
            except:
                pass
                
            # 기존 원격 저장소가 있으면 제거 후 다시 추가
            self.update_status("원격 저장소 설정 중...", 85)
            try:
                self.run_command("git remote remove origin", cwd=new_backup_path)
            except:
                pass
            self.run_command(f"git remote add origin {self.github_repo}", cwd=new_backup_path)
            self.log("원격 저장소 설정 완료")
            
            self.update_status("변경사항 커밋 중...", 88)
            
            # 커밋
            self.update_status("파일 스테이징 중...", 90)
            self.run_command("git add .", cwd=new_backup_path)
            self.log("모든 파일 스테이징 완료")
            
            self.update_status("커밋 생성 중...", 92)
            self.run_command(f'git commit -m "{self.commit_message}"', cwd=new_backup_path)
            self.log("커밋 생성 완료")
            
            self.update_status("GitHub에 업로드 중...", 95)
            
            # 기존 저장소 클론 (있는 경우)
            temp_clone_dir = os.path.join(parent_dir, "temp_clone")
            try:
                if os.path.exists(temp_clone_dir):
                    shutil.rmtree(temp_clone_dir)
                self.run_command(f"git clone {self.github_repo} {temp_clone_dir}")
                self.log("기존 저장소 클론 완료")
                
                # 기존 파일들을 새 백업 폴더로 복사
                for item in os.listdir(temp_clone_dir):
                    if item != '.git':
                        src_path = os.path.join(temp_clone_dir, item)
                        dst_path = os.path.join(new_backup_path, item)
                        if os.path.isdir(src_path):
                            shutil.copytree(src_path, dst_path)
                        else:
                            shutil.copy2(src_path, dst_path)
                self.log("기존 백업 파일들 복사 완료")
                
                # 임시 클론 폴더 삭제
                shutil.rmtree(temp_clone_dir)
                
            except Exception as e:
                self.log(f"기존 저장소 클론 실패 (새 저장소로 시작): {e}")
            
            # 원격 변경사항 가져오기
            try:
                self.run_command("git pull origin main --allow-unrelated-histories", cwd=new_backup_path)
                self.log("원격 변경사항 병합 완료")
            except Exception as e:
                self.log(f"원격 변경사항 병합 실패 (새 브랜치로 시작): {e}")
            
            # 푸시
            self.run_command("git branch -M main", cwd=new_backup_path)
            self.run_command("git push -u origin main", cwd=new_backup_path)
            
            # 성공
            self.update_status("백업 완료!", 100)
            self.log("🎉 GitHub 백업이 성공적으로 완료되었습니다!")
            self._backup_completed = True
            
            # 백업 폴더 자동 열기
            try:
                os.startfile(new_backup_path)
                self.log(f"백업 폴더 열기: {new_backup_path}")
            except Exception as e:
                self.log(f"폴더 열기 실패: {e}")
            
            messagebox.showinfo("성공", 
                              f"GitHub로 백업 완료!\n\n"
                              f"📁 백업 폴더: {new_backup_path}\n"
                              f"🌐 GitHub 저장소: {self.github_repo}\n\n"
                              f"백업 폴더가 자동으로 열립니다.")
            
        except Exception as e:
            error_msg = f"백업 실패: {e}"
            self.update_status("백업 실패")
            self.log(f"❌ 오류: {e}")
            messagebox.showerror("에러", error_msg)
        
        finally:
            # UI 복원
            self.progress['value'] = 0
            self.btn_backup.config(state=tk.NORMAL)
            self.btn_select.config(state=tk.NORMAL)
            if not hasattr(self, '_backup_completed'):
                self.update_status("대기 중...", 0)
            self._backup_completed = False
    
    def start_backup(self):
        """백업 시작"""
        self.backup_to_github()
    
    def run(self):
        """앱 실행"""
        try:
            self.root.mainloop()
        except Exception as e:
            print(f"GUI 오류: {e}")
            messagebox.showerror("오류", f"프로그램 오류: {e}")

def main():
    """메인 함수"""
    try:
        app = GitHubBackupGUI()
        app.run()
    except Exception as e:
        print(f"프로그램 시작 오류: {e}")
        messagebox.showerror("오류", f"프로그램 시작 실패: {e}")

if __name__ == "__main__":
    main()
