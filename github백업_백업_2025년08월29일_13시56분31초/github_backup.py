import os
import subprocess
import shutil
import datetime
import json
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from threading import Thread

class GitHubBackupApp:
    def __init__(self):
        self.backup_folder = None
        self.config_file = "backup_config.json"
        self.load_config()
        
        self.setup_gui()
    
    def load_config(self):
        """설정 파일 로드"""
        self.config = {
            "github_repo": "https://github.com/comfreec/dev.git",
            "commit_message": "자동 백업",
            "backup_history": []
        }
        
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    saved_config = json.load(f)
                    self.config.update(saved_config)
            except Exception as e:
                print(f"설정 파일 로드 실패: {e}")
    
    def save_config(self):
        """설정 파일 저장"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"설정 파일 저장 실패: {e}")
    
    def setup_gui(self):
        """GUI 설정"""
        self.root = tk.Tk()
        self.root.title("GitHub 자동 백업 프로그램 v2.0")
        self.root.geometry("600x500")
        
        # 메인 프레임
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 설정 섹션
        settings_frame = ttk.LabelFrame(main_frame, text="설정", padding="10")
        settings_frame.pack(fill=tk.X, pady=(0, 10))
        
        # GitHub 저장소 URL
        ttk.Label(settings_frame, text="GitHub 저장소 URL:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.repo_entry = ttk.Entry(settings_frame, width=50)
        self.repo_entry.insert(0, self.config["github_repo"])
        self.repo_entry.grid(row=0, column=1, padx=(10, 0), pady=5)
        
        # 커밋 메시지
        ttk.Label(settings_frame, text="커밋 메시지:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.commit_entry = ttk.Entry(settings_frame, width=50)
        self.commit_entry.insert(0, self.config["commit_message"])
        self.commit_entry.grid(row=1, column=1, padx=(10, 0), pady=5)
        
        # 폴더 선택 섹션
        folder_frame = ttk.LabelFrame(main_frame, text="백업 폴더", padding="10")
        folder_frame.pack(fill=tk.X, pady=(0, 10))
        
        self.btn_select = ttk.Button(folder_frame, text="📂 폴더 선택", command=self.select_folder)
        self.btn_select.pack(pady=5)
        
        self.lbl_folder = ttk.Label(folder_frame, text="선택된 폴더 없음")
        self.lbl_folder.pack(pady=5)
        
        # 백업 버튼
        self.btn_backup = ttk.Button(main_frame, text="☁️ GitHub로 백업", command=self.start_backup)
        self.btn_backup.pack(pady=10)
        
        # 진행 상황 표시
        self.progress = ttk.Progressbar(main_frame, mode='indeterminate')
        self.progress.pack(fill=tk.X, pady=5)
        
        self.lbl_status = ttk.Label(main_frame, text="대기 중...")
        self.lbl_status.pack(pady=5)
        
        # 백업 히스토리
        history_frame = ttk.LabelFrame(main_frame, text="백업 히스토리", padding="10")
        history_frame.pack(fill=tk.BOTH, expand=True, pady=(10, 0))
        
        # 히스토리 트리뷰
        columns = ("날짜", "폴더", "상태")
        self.history_tree = ttk.Treeview(history_frame, columns=columns, show="headings", height=8)
        
        for col in columns:
            self.history_tree.heading(col, text=col)
            self.history_tree.column(col, width=150)
        
        scrollbar = ttk.Scrollbar(history_frame, orient=tk.VERTICAL, command=self.history_tree.yview)
        self.history_tree.configure(yscrollcommand=scrollbar.set)
        
        self.history_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.update_history_display()
    
    def select_folder(self):
        """폴더 선택"""
        folder = filedialog.askdirectory()
        if folder:
            self.backup_folder = folder
            self.lbl_folder.config(text=f"선택된 폴더: {folder}")
    
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
    
    def add_history_entry(self, date, folder, status):
        """히스토리에 항목 추가"""
        self.config["backup_history"].append({
            "date": date,
            "folder": folder,
            "status": status
        })
        # 최근 20개만 유지
        if len(self.config["backup_history"]) > 20:
            self.config["backup_history"] = self.config["backup_history"][-20:]
        self.save_config()
        self.update_history_display()
    
    def update_history_display(self):
        """히스토리 표시 업데이트"""
        # 기존 항목 삭제
        for item in self.history_tree.get_children():
            self.history_tree.delete(item)
        
        # 새 항목 추가
        for entry in reversed(self.config["backup_history"]):
            self.history_tree.insert("", "end", values=(
                entry["date"],
                entry["folder"],
                entry["status"]
            ))
    
    def backup_to_github(self):
        """GitHub 백업 실행"""
        try:
            # 설정 저장
            self.config["github_repo"] = self.repo_entry.get()
            self.config["commit_message"] = self.commit_entry.get()
            self.save_config()
            
            if not self.backup_folder:
                raise Exception("폴더를 선택해주세요!")
            
            # Git 설치 확인
            try:
                self.run_command("git --version")
            except:
                raise Exception("Git이 설치되어 있지 않습니다. Git을 먼저 설치해주세요.")
            
            # 디버깅 정보 출력
            print(f"백업 폴더: {self.backup_folder}")
            print(f"GitHub 저장소: {self.config['github_repo']}")
            print(f"커밋 메시지: {self.config['commit_message']}")
            
            self.update_status("백업 폴더 생성 중...")
            
            # 날짜+시간 기반 새 백업 폴더명 생성
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            parent_dir = os.path.dirname(self.backup_folder)
            folder_name = os.path.basename(self.backup_folder)
            new_backup_path = os.path.join(parent_dir, f"{folder_name}_{timestamp}")
            
            # 기존에 같은 이름 폴더 있으면 삭제 후 새로 생성
            if os.path.exists(new_backup_path):
                shutil.rmtree(new_backup_path)
            
            self.update_status("파일 복사 중...")
            # 백업 폴더 내에 원본 폴더명으로 하위 폴더 생성
            folder_name = os.path.basename(self.backup_folder)
            backup_subfolder = os.path.join(new_backup_path, folder_name)
            shutil.copytree(self.backup_folder, backup_subfolder)
            
            # Git 초기화 (단순화)
            self.update_status("Git 초기화 중...")
            self.run_command("git init", cwd=new_backup_path)
            self.run_command(f"git remote add origin {self.config['github_repo']}", cwd=new_backup_path)
            
            # 변경사항 추가 및 커밋
            self.update_status("변경사항 커밋 중...")
            self.run_command("git add .", cwd=new_backup_path)
            self.run_command(f"git commit -m \"{self.config['commit_message']}\"", cwd=new_backup_path)
            
            # 원격 푸시 (강제 푸시로 변경)
            self.update_status("GitHub에 업로드 중...")
            self.run_command("git branch -M main", cwd=new_backup_path)
            # 기존 원격 저장소 내용을 덮어쓰기 위해 강제 푸시 사용
            self.run_command("git push -u origin main --force", cwd=new_backup_path)
            
            # 성공 메시지
            success_msg = f"GitHub로 백업 완료!\n백업 폴더: {new_backup_path}"
            messagebox.showinfo("성공", success_msg)
            
            # 히스토리에 추가
            self.add_history_entry(
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                os.path.basename(new_backup_path),
                "성공"
            )
            
        except Exception as e:
            error_msg = f"백업 실패: {e}"
            messagebox.showerror("에러", error_msg)
            
            # 히스토리에 실패 기록 추가
            self.add_history_entry(
                datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "백업 실패",
                f"실패: {str(e)[:50]}..."
            )
        
        finally:
            self.progress.stop()
            self.progress.pack_forget()
            self.btn_backup.config(state=tk.NORMAL)
            self.update_status("대기 중...")
    
    def start_backup(self):
        """백업 시작 (별도 스레드에서 실행)"""
        self.btn_backup.config(state=tk.DISABLED)
        self.progress.pack(fill=tk.X, pady=5)
        self.progress.start()
        
        # 별도 스레드에서 백업 실행
        backup_thread = Thread(target=self.backup_to_github)
        backup_thread.daemon = True
        backup_thread.start()
    
    def run(self):
        """앱 실행"""
        self.root.mainloop()

if __name__ == "__main__":
    try:
        app = GitHubBackupApp()
        app.run()
    except Exception as e:
        print(f"프로그램 실행 중 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        input("엔터 키를 눌러 종료하세요...")
