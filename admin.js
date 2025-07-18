// admin.js - 보안 및 관리자 모듈 (난독화)
(function(_0x1a2b3c,_0x4d5e6f){const _0x7g8h9i=_0x1a2b3c();while(!![]){try{const _0x2k3l4m=-parseInt(_0x7g8h9i(0x1a8))/0x1*(-parseInt(_0x7g8h9i(0x1b9))/0x2)+parseInt(_0x7g8h9i(0x1ca))/0x3+-parseInt(_0x7g8h9i(0x1db))/0x4+parseInt(_0x7g8h9i(0x1ec))/0x5*(parseInt(_0x7g8h9i(0x1fd))/0x6)+parseInt(_0x7g8h9i(0x20e))/0x7*(-parseInt(_0x7g8h9i(0x21f))/0x8)+-parseInt(_0x7g8h9i(0x230))/0x9+parseInt(_0x7g8h9i(0x241))/0xa;if(_0x2k3l4m===_0x4d5e6f)break;else _0x1a2b3c['push'](_0x1a2b3c['shift']());}catch(_0x3n4o5p){_0x1a2b3c['push'](_0x1a2b3c['shift']());}}}(_0x5q6r7s,0x8t9u0v));function _0x5q6r7s(){const _0xaw1bx2=['admin','generateAdminKey','getDate','getFullYear','getMonth','padStart','substring','btoa','toISOString','slice','replace','split','join','downloadAsCSV','getVisitorLogs','length','alert','CSV','headers','forEach','push','Blob','createElement','setAttribute','click','removeChild','appendChild','showLogModal','innerHTML','getElementById','style','display','addEventListener','keydown','ctrlKey','shiftKey','preventDefault','prompt','classList','remove','contextmenu','selectstart','dragstart','F12','console','clear','log','color','font-size','font-weight'];_0x5q6r7s=function(){return _0xaw1bx2;};return _0x5q6r7s();}function _0x1a2b3c(_0x4d5e6f,_0x7g8h9i){const _0x5q6r7s=_0x5q6r7s();return _0x1a2b3c=function(_0x1a2b3c,_0x4d5e6f){_0x1a2b3c=_0x1a2b3c-0x1a8;let _0x7g8h9i=_0x5q6r7s[_0x1a2b3c];return _0x7g8h9i;},_0x1a2b3c(_0x4d5e6f,_0x7g8h9i);}

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
        
        // console.log 훅킹으로 개발자도구 사용 감지
        const originalLog = console.log;
        console.log = function() {
            originalLog.apply(console, arguments);
            if (arguments.length > 0 && typeof arguments[0] === 'string' && arguments[0].includes('%c')) {
                return;
            }
            console.clear();
            console.log('%c콘솔 사용이 감지되었습니다!', 'color: red; font-size: 16px; font-weight: bold;');
        };
    }
};

// 난독화된 관리자 모듈
const AdminModule = (function() {
    // Base64로 인코딩된 키들
    const _0xa1b2c3 = {
        [btoa('storageKey')]: atob('YWlfZWR1X2tpdF92aXNpdG9yX2xvZw=='), // ai_edu_kit_visitor_log
        
        // 날짜 기반 동적 관리자 키 생성
        [btoa('adminPattern')]: () => {
            const _0xd4e5f6 = new Date();
            const _0xg7h8i9 = _0xd4e5f6.getFullYear() + '' + 
                (_0xd4e5f6.getMonth() + 1).toString().padStart(2, '0') + '' + 
                _0xd4e5f6.getDate().toString().padStart(2, '0');
            return btoa(atob('YWRtaW4=') + _0xg7h8i9).substring(0, 8); // admin + 날짜
        },
        
        // 관리자 키 검증
        [btoa('verify')]: (_0xj1k2l3) => _0xj1k2l3 === _0xa1b2c3[btoa('adminPattern')](),
        
        // 방문자 로그 가져오기
        [btoa('getLogs')]: () => {
            const _0xm4n5o6 = localStorage.getItem(_0xa1b2c3[btoa('storageKey')]);
            return _0xm4n5o6 ? JSON.parse(_0xm4n5o6) : [];
        },
        
        // CSV 다운로드 기능
        [btoa('downloadCSV')]: () => {
            const _0xp7q8r9 = _0xa1b2c3[btoa('getLogs')]();
            if (_0xp7q8r9.length === 0) {
                alert('다운로드할 로그가 없습니다.');
                return;
            }
            
            // CSV 헤더 (Base64 디코딩)
            const _0xs1t2u3 = ['번호', '날짜', '시간', 'IP주소', '국가', '도시', '참조페이지', '방문자ID', 'User Agent'];
            let _0xv4w5x6 = _0xs1t2u3.join(',') + '\n';
            
            _0xp7q8r9.forEach((_0xy7z8a9, _0xb1c2d3) => {
                const _0xe4f5g6 = [
                    _0xb1c2d3 + 1,
                    `"${_0xy7z8a9.date}"`,
                    `"${_0xy7z8a9.time}"`,
                    `"${_0xy7z8a9.ip}"`,
                    `"${_0xy7z8a9.country}"`,
                    `"${_0xy7z8a9.city}"`,
                    `"${_0xy7z8a9.referrer === 'direct' ? '직접 접속' : _0xy7z8a9.referrer}"`,
                    `"${_0xy7z8a9.visitorId}"`,
                    `"${_0xy7z8a9.userAgent}"`
                ];
                _0xv4w5x6 += _0xe4f5g6.join(',') + '\n';
            });
            
            // UTF-8 BOM 추가로 한글 인코딩 지원
            const _0xh7i8j9 = new Blob(['\uFEFF' + _0xv4w5x6], { type: 'text/csv;charset=utf-8;' });
            const _0xk1l2m3 = document.createElement('a');
            
            if (_0xk1l2m3.download !== undefined) {
                const _0xn4o5p6 = URL.createObjectURL(_0xh7i8j9);
                _0xk1l2m3.setAttribute('href', _0xn4o5p6);
                _0xk1l2m3.setAttribute('download', `ai_edu_kit_visitor_log_${new Date().toISOString().split('T')[0]}.csv`);
                _0xk1l2m3.style.visibility = 'hidden';
                document.body.appendChild(_0xk1l2m3);
                _0xk1l2m3.click();
                document.body.removeChild(_0xk1l2m3);
                URL.revokeObjectURL(_0xn4o5p6);
            }
        },
        
        // 로그 모달 표시
        [btoa('showModal')]: () => {
            const _0xq7r8s9 = _0xa1b2c3[btoa('getLogs')]();
            const _0xt1u2v3 = document.getElementById('logContent');
            
            if (_0xq7r8s9.length === 0) {
                _0xt1u2v3.innerHTML = '<p class="text-gray-500 text-center py-8">아직 방문 기록이 없습니다.</p>';
            } else {
                let _0xw4x5y6 = `
                    <div class="mb-4 flex justify-between items-center">
                        <span class="text-sm text-gray-600">총 ${_0xq7r8s9.length}개의 방문 기록</span>
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
                const displayLogs = _0xq7r8s9.slice(-100).reverse();
                displayLogs.forEach((_0xz7a8b9, _0xc1d2e3) => {
                    _0xw4x5y6 += `
                        <tr class="${_0xc1d2e3 % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50">
                            <td class="border border-gray-200 px-2 py-1 text-xs">${_0xq7r8s9.length - _0xc1d2e3}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${_0xz7a8b9.date}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${_0xz7a8b9.time}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs font-mono">${_0xz7a8b9.ip}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${_0xz7a8b9.country}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs">${_0xz7a8b9.city}</td>
                            <td class="border border-gray-200 px-2 py-1 text-xs truncate max-w-32" title="${_0xz7a8b9.referrer}">${_0xz7a8b9.referrer === 'direct' ? '직접' : _0xz7a8b9.referrer}</td>
                        </tr>
                    `;
                });
                
                _0xw4x5y6 += '</tbody></table></div>';
                if (_0xq7r8s9.length > 100) {
                    _0xw4x5y6 += '<p class="text-xs text-gray-500 mt-2 text-center">최근 100개 기록만 표시됩니다. 전체 로그는 CSV 다운로드를 이용하세요.</p>';
                }
                _0xt1u2v3.innerHTML = _0xw4x5y6;
            }
            
            document.getElementById('logModal').style.display = 'flex';
        }
    };
    
    return {
        // 관리자 모듈 초기화
        init() {
            // Ctrl+Shift+A 키 조합으로 관리자 패널 활성화
            document.addEventListener('keydown', (_0xf4g5h6) => {
                if (_0xf4g5h6.ctrlKey && _0xf4g5h6.shiftKey && _0xf4g5h6.key === 'A') {
                    _0xf4g5h6.preventDefault();
                    _0xf4g5h6.stopPropagation();
                    
                    const _0xi7j8k9 = prompt('🔐 오늘의 관리자 인증 코드를 입력하세요:');
                    if (_0xa1b2c3[btoa('verify')](_0xi7j8k9)) {
                        document.getElementById('adminPanel').classList.remove('hidden');
                        alert('✅ 관리자 모드가 활성화되었습니다.');
                        console.clear();
                        console.log('%c관리자 모드 활성화', 'color: green; font-size: 16px; font-weight: bold;');
                    } else if (_0xi7j8k9) {
                        alert('❌ 잘못된 인증 코드입니다.');
                        console.clear();
                        console.log('%c잘못된 접근 시도', 'color: red; font-size: 14px;');
                    }
                }
            });
            
            // 관리자 버튼 이벤트 리스너
            const _0xl1m2n3 = document.getElementById('showLogBtn');
            const _0xo4p5q6 = document.getElementById('downloadLogBtn');
            
            if (_0xl1m2n3) {
                _0xl1m2n3.addEventListener('click', (e) => {
                    e.preventDefault();
                    _0xa1b2c3[btoa('showModal')]();
                });
            }
            
            if (_0xo4p5q6) {
                _0xo4p5q6.addEventListener('click', (e) => {
                    e.preventDefault();
                    _0xa1b2c3[btoa('downloadCSV')]();
                });
            }
        },
        
        // 개발자용 관리자 코드 조회 (배포시 제거 권장)
        getAdminCode() {
            return _0xa1b2c3[btoa('adminPattern')]();
        },
        
        // 통계 정보 조회
        getStats() {
            const logs = _0xa1b2c3[btoa('getLogs')]();
            const today = new Date().toLocaleDateString('ko-KR');
            const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR');
            
            return {
                total: logs.length,
                today: logs.filter(log => log.date === today).length,
                thisWeek: logs.filter(log => new Date(log.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
                unique: new Set(logs.map(log => log.visitorId)).size,
                countries: [...new Set(logs.map(log => log.country))].length
            };
        }
    };
})();

// 페이지 로드 시 보안 및 관리자 모듈 초기화
if (typeof window !== 'undefined') {
    // 즉시 보안 모듈 활성화
    SecurityModule.init();
    
    // DOM 로드 후 관리자 모듈 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AdminModule.init();
        });
    } else {
        AdminModule.init();
    }
    
    // 개발용 관리자 코드 표시 (배포시 제거)
    setTimeout(() => {
        console.clear();
        console.log('%c🔑 오늘의 관리자 코드', 'color: blue; font-size: 14px; font-weight: bold; background: lightblue; padding: 2px 8px; border-radius: 4px;');
        console.log('%c' + AdminModule.getAdminCode(), 'color: blue; font-size: 16px; font-weight: bold; background: yellow; padding: 4px 8px; border-radius: 4px;');
        console.log('%cCtrl+Shift+A 키로 관리자 패널을 활성화하세요.', 'color: gray; font-size: 12px;');
        
        // 통계 정보도 표시
        const stats = AdminModule.getStats();
        console.log('%c📊 현재 통계', 'color: green; font-size: 12px; font-weight: bold;');
        console.table(stats);
    }, 1000);
}

// 추가 보안: 스크립트 조작 방지
Object.freeze(SecurityModule);
Object.freeze(AdminModule);

// 전역 변수 오염 방지
(function() {
    'use strict';
    
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
})();,