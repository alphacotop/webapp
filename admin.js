// admin.js - 보안 및 관리자 모듈
(function() {
    'use strict';

    // 보안 모듈 - 우클릭 및 개발자도구 방지
    const SecurityModule = {
        init() {
            this.disableRightClick();
            this.disableKeyShortcuts();
            this.disableTextSelection();
            this.disableDragDrop();
            this.setupConsoleWarning();
            this.detectDevTools();
        },
        
        // 강화된 우클릭 방지
        disableRightClick() {
            // contextmenu 이벤트 완전 차단
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }, true);
            
            // 마우스 우클릭 버튼 직접 차단
            document.addEventListener('mousedown', function(e) {
                if (e.button === 2) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }, true);
            
            document.addEventListener('mouseup', function(e) {
                if (e.button === 2) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }, true);

            // 추가 우클릭 방지 (모든 엘리먼트에 적용)
            document.addEventListener('contextmenu', function(e) {
                return false;
            });
            
            // oncontextmenu 속성도 차단
            document.oncontextmenu = function() { return false; };
        },
        
        // 개발자도구 키 조합 방지
        disableKeyShortcuts() {
            document.addEventListener('keydown', function(e) {
                // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S 방지
                if (e.key === 'F12' || 
                    e.keyCode === 123 ||
                    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                    (e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key)) ||
                    (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                    (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                    (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
                    (e.ctrlKey && e.keyCode === 83)) { // Ctrl+S
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
                
                // Ctrl+A (전체 선택) 방지 (관리자 모드 제외)
                if (e.ctrlKey && e.key === 'a' && !e.shiftKey) {
                    e.preventDefault();
                    return false;
                }
            }, true);
            
            // 키보드 이벤트 추가 차단
            document.addEventListener('keypress', function(e) {
                if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 117)) { // Ctrl+U
                    e.preventDefault();
                    return false;
                }
            }, true);
        },
        
        // 텍스트 선택 완전 방지
        disableTextSelection() {
            // JavaScript 이벤트로 선택 방지
            document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
            }, true);
            
            document.addEventListener('mousedown', function(e) {
                if (e.detail > 1) { // 더블클릭 이상 방지
                    e.preventDefault();
                    return false;
                }
            });
            
            // 전역 속성 설정
            document.onselectstart = function() { return false; };
            document.onmousedown = function() { return false; };
            
            // CSS로도 선택 방지 강화
            const style = document.createElement('style');
            style.innerHTML = `
                * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                    -khtml-user-select: none !important;
                }
                input, textarea, [contenteditable] {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
                ::selection { background: transparent !important; }
                ::-moz-selection { background: transparent !important; }
            `;
            document.head.appendChild(style);
        },
        
        // 드래그앤드롭 방지
        disableDragDrop() {
            document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);
            
            document.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);
            
            document.addEventListener('dragover', function(e) {
                e.preventDefault();
                return false;
            }, true);
        },
        
        // 콘솔 경고 메시지 및 감시
        setupConsoleWarning() {
            console.clear();
            console.log('%c⚠️ 보안 경고', 'color: red; font-size: 30px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
            console.log('%c이 기능은 개발자를 위한 것입니다.\n악의적인 코드 입력은 보안에 위험할 수 있습니다.', 'color: red; font-size: 16px; font-weight: bold;');
            console.log('%c접근이 제한된 영역입니다.', 'color: orange; font-size: 14px; background: yellow; padding: 2px;');
            
            // 주기적 콘솔 클리어 및 경고
            setInterval(() => {
                console.clear();
                console.log('%c🚫 무단 접근 금지', 'color: red; font-size: 20px; font-weight: bold;');
                console.log('%c개발자 도구 사용을 감지했습니다.', 'color: orange; font-size: 14px;');
            }, 3000);
        },
        
        // 개발자도구 감지
        detectDevTools() {
            let devtools = false;
            const threshold = 160;
            
            // 창 크기 변화로 개발자도구 감지
            setInterval(() => {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools) {
                        devtools = true;
                        console.clear();
                        console.log('%c개발자 도구가 감지되었습니다!', 'color: red; font-size: 20px; font-weight: bold;');
                        console.log('%c보안을 위해 페이지 기능이 제한됩니다.', 'color: orange; font-size: 14px;');
                    }
                } else {
                    devtools = false;
                }
            }, 500);
        }
    };

    // 관리자 모듈
    const AdminModule = (function() {
        // 설정값들
        const config = {
            storageKey: 'ai_edu_kit_visitor_log',
            
            // 날짜 기반 동적 관리자 키 생성
            generateAdminKey: function() {
                const today = new Date();
                const dateStr = today.getFullYear() + '' + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + '' + 
                    today.getDate().toString().padStart(2, '0');
                return btoa('admin' + dateStr).substring(0, 8);
            },
            
            // 관리자 키 검증
            verifyAdmin: function(inputKey) {
                return inputKey === this.generateAdminKey();
            },
            
            // 방문자 로그 가져오기
            getVisitorLogs: function() {
                const logs = localStorage.getItem(this.storageKey);
                return logs ? JSON.parse(logs) : [];
            }
        };
        
        // CSV 다운로드 기능
        const downloadCSV = function() {
            const logs = config.getVisitorLogs();
            if (logs.length === 0) {
                alert('다운로드할 로그가 없습니다.');
                return;
            }
            
            // CSV 헤더
            const headers = ['번호', '날짜', '시간', 'IP주소', '국가', '도시', '참조페이지', '방문자ID', 'User Agent'];
            let csvContent = headers.join(',') + '\n';
            
            logs.forEach((log, index) => {
                const row = [
                    index + 1,
                    `"${log.date}"`,
                    `"${log.time}"`,
                    `"${log.ip}"`,
                    `"${log.country}"`,
                    `"${log.city}"`,
                    `"${log.referrer === 'direct' ? '직접 접속' : log.referrer}"`,
                    `"${log.visitorId}"`,
                    `"${log.userAgent}"`
                ];
                csvContent += row.join(',') + '\n';
            });
            
            // UTF-8 BOM 추가로 한글 인코딩 지원
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `ai_edu_kit_visitor_log_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        };
        
        // 로그 모달 표시
        const showLogModal = function() {
            const logs = config.getVisitorLogs();
            const logContent = document.getElementById('logContent');
            
            if (!logContent) {
                alert('로그 컨테이너를 찾을 수 없습니다.');
                return;
            }
            
            if (logs.length === 0) {
                logContent.innerHTML = '<p class="text-gray-500 text-center py-8">아직 방문 기록이 없습니다.</p>';
            } else {
                let logHtml = `
                    <div class="mb-4 flex justify-between items-center">
                        <span class="text-sm text-gray-600">총 ${logs.length}개의 방문 기록</span>
                        <span class="text-xs text-gray-500">최근 업데이트: ${new Date().toLocaleString('ko-KR')}</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">번호</th>
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">날짜</th>
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">시간</th>
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">IP</th>
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">국가</th>
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">도시</th>
                                    <th class="border border-gray-200 px-2 py-2 text-left text-xs">참조</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                // 최신 로그부터 표시 (최대 100개)
                const displayLogs = logs.slice(-100).reverse();
                displayLogs.forEach((log, index) => {
                    logHtml += `
                        <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50">
                            <td class="border border-gray-200 px-2 py-1 text-xs">${logs.length - index}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${log.date}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${log.time}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs font-mono">${log.ip}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${log.country}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${log.city}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs truncate max-w-32" title="${log.referrer}">${log.referrer === 'direct' ? '직접' : log.referrer}</td>
                        </tr>
                    `;
                });
                
                logHtml += '</tbody></table></div>';
                if (logs.length > 100) {
                    logHtml += '<p class="text-xs text-gray-500 mt-2 text-center">최근 100개 기록만 표시됩니다. 전체 로그는 CSV 다운로드를 이용하세요.</p>';
                }
                logContent.innerHTML = logHtml;
            }
            
            const modal = document.getElementById('logModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        };
        
        // 통계 정보 조회
        const getStats = function() {
            const logs = config.getVisitorLogs();
            const today = new Date().toLocaleDateString('ko-KR');
            const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR');
            
            return {
                total: logs.length,
                today: logs.filter(log => log.date === today).length,
                thisWeek: logs.filter(log => new Date(log.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
                unique: new Set(logs.map(log => log.visitorId)).size,
                countries: [...new Set(logs.map(log => log.country))].length
            };
        };
        
        return {
            // 관리자 모듈 초기화
            init: function() {
                // Ctrl+Shift+A 키 조합으로 관리자 패널 활성화
                document.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const inputKey = prompt('🔐 오늘의 관리자 인증 코드를 입력하세요:');
                        if (config.verifyAdmin(inputKey)) {
                            const adminPanel = document.getElementById('adminPanel');
                            if (adminPanel) {
                                adminPanel.classList.remove('hidden');
                                alert('✅ 관리자 모드가 활성화되었습니다.');
                                console.clear();
                                console.log('%c관리자 모드 활성화', 'color: green; font-size: 16px; font-weight: bold;');
                            }
                        } else if (inputKey) {
                            alert('❌ 잘못된 인증 코드입니다.');
                            console.clear();
                            console.log('%c잘못된 접근 시도', 'color: red; font-size: 14px;');
                        }
                    }
                });
                
                // 관리자 버튼 이벤트 리스너
                const showLogBtn = document.getElementById('showLogBtn');
                const downloadLogBtn = document.getElementById('downloadLogBtn');
                
                if (showLogBtn) {
                    showLogBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        showLogModal();
                    });
                }
                
                if (downloadLogBtn) {
                    downloadLogBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        downloadCSV();
                    });
                }
            },
            
            // 개발자용 관리자 코드 조회 (배포시 제거 권장)
            getAdminCode: function() {
                return config.generateAdminKey();
            },
            
            // 통계 정보 조회
            getStats: getStats
        };
    })();

    // 추가 보안: 스크립트 조작 방지
    Object.freeze(SecurityModule);
    Object.freeze(AdminModule);

    // 추가 보안 기능
    (function() {
        // eval 함수 비활성화
        window.eval = function() {
            throw new Error('eval() 함수는 보안상 비활성화되었습니다.');
        };
        
        // Function 생성자 비활성화
        window.Function = function() {
            throw new Error('Function 생성자는 보안상 비활성화되었습니다.');
        };
        
        // setTimeout/setInterval에서 문자열 실행 방지
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;
        
        window.setTimeout = function(callback, delay) {
            if (typeof callback === 'string') {
                throw new Error('setTimeout에서 문자열 코드 실행은 보안상 차단되었습니다.');
            }
            return originalSetTimeout.apply(this, arguments);
        };
        
        window.setInterval = function(callback, delay) {
            if (typeof callback === 'string') {
                throw new Error('setInterval에서 문자열 코드 실행은 보안상 차단되었습니다.');
            }
            return originalSetInterval.apply(this, arguments);
        };
    })();

    // 페이지 로드 시 보안 및 관리자 모듈 초기화
    if (typeof window !== 'undefined') {
        // 즉시 보안 모듈 활성화
        SecurityModule.init();
        
        // DOM 로드 후 관리자 모듈 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                AdminModule.init();
            });
        } else {
            AdminModule.init();
        }
        
        // 개발용 관리자 코드 표시 (배포시 제거)
        setTimeout(function() {
            console.clear();
            console.log('%c🔑 오늘의 관리자 코드', 'color: blue; font-size: 14px; font-weight: bold; background: lightblue; padding: 2px 8px; border-radius: 4px;');
            console.log('%c' + AdminModule.getAdminCode(), 'color: blue; font-size: 16px; font-weight: bold; background: yellow; padding: 4px 8px; border-radius: 4px;');
            console.log('%cCtrl+Shift+A 키로 관리자 패널을 활성화하세요.', 'color: gray; font-size: 12px;');
            
            // 통계 정보도 표시
            const stats = AdminModule.getStats();
            console.log('%c📊 현재 통계', 'color: green; font-size: 12px; font-weight: bold;');
            console.table(stats);
        }, 1000);
        
        // 전역 객체로 노출 (개발용)
        window.AdminModule = AdminModule;
    }

})();