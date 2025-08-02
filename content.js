// 外宣標記器 - 內容腳本
(function() {
    'use strict';

    // 載入廣告名稱列表
    let adNames = [];
    let isScanning = false; // 防止重複掃描
    let scanTimeout = null; // 防抖動計時器
    let markedElements = new WeakSet(); // 使用 WeakSet 追蹤已標記的元素

    // 常見簡繁字對照表（50字）
    const simpleToTraditionalMap = {
        '峡': '峽', '学': '學', 
        '国': '國', '际': '際', '问': '問', '题': '題', '后': '後',
        '发': '發', '台': '臺', '里': '裡', '面': '麵', '只': '隻',
        '干': '幹', '钟': '鐘', '广': '廣', '厉': '厲', '龙': '龍',
        '东': '東', '西': '西', '南': '南', '北': '北', '中': '中',
        '华': '華', '学': '學', '习': '習', '经': '經', '济': '濟',
        '政': '政', '治': '治', '党': '黨', '团': '團', '军': '軍',
        '队': '隊', '员': '員', '会': '會', '议': '議', '论': '論',
        '报': '報', '社': '社', '记': '記', '者': '者', '编': '編',
        '辑': '輯', '出': '出', '版': '版', '社': '社', '电': '電',
        '视': '視', '台': '臺', '网': '網', '络': '絡', '信': '信'
    };
    
    const traditionalToSimpleMap = Object.fromEntries(
        Object.entries(simpleToTraditionalMap).map(([simp, trad]) => [trad, simp])
    );
    
    // 轉換函數
    function convertChinese(text, toTraditional = true) {
        const map = toTraditional ? simpleToTraditionalMap : traditionalToSimpleMap;
        return [...text].map(char => map[char] || char).join('');
    }

    // 從 JSON 檔案載入廣告名稱
    fetch(chrome.runtime.getURL('ad_names.json'))
        .then(response => response.json())
        .then(data => {
            adNames = data;
            console.log(`已載入 ${adNames.length} 個廣告名稱`);
            startScanning();
        })
        .catch(error => {
            console.error('載入廣告名稱失敗:', error);
        });

    // 開始掃描頁面
    function startScanning() {
        // 等待頁面載入完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(scanPage, 1000); // 延遲掃描
            });
        } else {
            setTimeout(scanPage, 1000); // 延遲掃描
        }

        // 監聽動態內容變化，使用更嚴格的防抖動
        const observer = new MutationObserver(function(mutations) {
            // 檢查是否有相關的變化
            const hasRelevantChanges = mutations.some(mutation => {
                return mutation.type === 'childList' && 
                       mutation.addedNodes.length > 0 &&
                       !mutation.target.hasAttribute('data-propaganda-marked');
            });

            if (!hasRelevantChanges) return;

            // 清除之前的計時器
            if (scanTimeout) {
                clearTimeout(scanTimeout);
            }
            
            // 設置新的計時器，增加防抖動時間
            scanTimeout = setTimeout(() => {
                if (!isScanning) {
                    scanPage();
                }
            }, 1000); // 增加到 1 秒
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 掃描頁面中的搜尋結果
    function scanPage() {
        if (isScanning) return; // 防止重複掃描
        
        isScanning = true;
        
        try {
            const searchResults = getSearchResults();
            
            searchResults.forEach(result => {
                if (!markedElements.has(result) && !result.hasAttribute('data-propaganda-marked')) {
                    checkAndMarkResult(result);
                }
            });
        } catch (error) {
            console.error('掃描頁面時發生錯誤:', error);
        } finally {
            isScanning = false;
        }
    }

    // 取得搜尋結果元素（更精確的選擇器）
    function getSearchResults() {
        const selectors = [
            // Google - 更精確的選擇器，只選取最外層容器
            'div[data-sokoban-container]',
            'div.g',
            // Bing
            '.b_algo',
            // Yahoo
            '.algo',
            // Baidu
            '.result',
            '.c-container',
            // 通用搜尋結果容器 - 更精確的層級
            '#search > div > div > div > div',
            '#search-results > div > div > div > div',
            '.search-result',
            '.result-item',
            // 更寬泛的選擇器 - 只選取直接子元素
            'div[class*="result"]:not([class*="result"] *)',
            'div[class*="item"]:not([class*="item"] *)',
            'div[class*="card"]:not([class*="card"] *)'
        ];

        let results = [];
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                // 過濾掉已經標記的元素和其子元素
                const filteredElements = Array.from(elements).filter(el => {
                    // 檢查元素本身是否已標記
                    if (markedElements.has(el) || el.hasAttribute('data-propaganda-marked')) {
                        return false;
                    }
                    
                    // 檢查父元素是否已標記
                    let parent = el.parentElement;
                    while (parent && parent !== document.body) {
                        if (markedElements.has(parent) || parent.hasAttribute('data-propaganda-marked')) {
                            return false;
                        }
                        parent = parent.parentElement;
                    }
                    
                    // 只選擇有文字內容的元素
                    const text = el.textContent || el.innerText || '';
                    if (text.trim().length < 10) {
                        return false;
                    }
                    
                    // 確保是獨立的搜尋結果項目，不是容器
                    const hasChildren = el.children.length > 0;
                    const isContainer = el.classList.contains('container') || 
                                      el.classList.contains('wrapper') ||
                                      el.id === 'search' ||
                                      el.id === 'search-results';
                    
                    if (isContainer) {
                        return false;
                    }
                    
                    return true;
                });
                
                results = results.concat(filteredElements);
            } catch (error) {
                console.warn('選擇器錯誤:', selector, error);
            }
        });

        return results;
    }

    // 檢查並標記結果
    function checkAndMarkResult(element) {
        // 避免重複處理
        if (markedElements.has(element) || element.hasAttribute('data-propaganda-marked')) {
            return;
        }

        const text = element.textContent || element.innerText || '';
        const title = element.querySelector('h1, h2, h3, h4, h5, h6, a')?.textContent || '';
        const link = element.querySelector('a')?.href || '';
        
        const fullText = `${title} ${text} ${link}`.toLowerCase();
        
        // 檢查是否包含廣告名稱（支援簡繁轉換）
        const matchedNames = adNames.filter(name => {
            const nameLower = name.toLowerCase();
            const nameTraditional = convertChinese(nameLower, true);
            const nameSimple = convertChinese(nameLower, false);
            
            // 檢查原文、繁體、簡體三種版本
            return fullText.includes(nameLower) || 
                   fullText.includes(nameTraditional) || 
                   fullText.includes(nameSimple);
        });

        if (matchedNames.length > 0) {
            // 找到包含關鍵字的具體項目，而不是整個容器
            const targetElement = findTargetElement(element, matchedNames[0]);
            if (targetElement) {
                markAsPropaganda(targetElement, matchedNames);
            }
        }
    }

    // 找到應該被標記的具體元素
    function findTargetElement(element, matchedName) {
        // 如果當前元素直接包含關鍵字，返回當前元素
        const text = element.textContent || element.innerText || '';
        const nameLower = matchedName.toLowerCase();
        const nameTraditional = convertChinese(nameLower, true);
        const nameSimple = convertChinese(nameLower, false);
        
        if (text.toLowerCase().includes(nameLower) || 
            text.toLowerCase().includes(nameTraditional) || 
            text.toLowerCase().includes(nameSimple)) {
            return element;
        }
        
        // 否則尋找子元素中包含關鍵字的元素
        const children = element.querySelectorAll('*');
        for (let child of children) {
            const childText = child.textContent || child.innerText || '';
            if (childText.toLowerCase().includes(nameLower) || 
                childText.toLowerCase().includes(nameTraditional) || 
                childText.toLowerCase().includes(nameSimple)) {
                // 找到包含關鍵字的子元素，返回其父元素（避免標記過小的元素）
                return child.parentElement || child;
            }
        }
        
        return element; // 如果找不到更精確的目標，返回原元素
    }

    // 標記為外宣內容
    function markAsPropaganda(element, matchedNames) {
        // 避免重複標記
        if (markedElements.has(element) || element.hasAttribute('data-propaganda-marked')) {
            return;
        }

        // 檢查父元素是否已經被標記
        let parent = element.parentElement;
        while (parent && parent !== document.body) {
            if (markedElements.has(parent) || parent.hasAttribute('data-propaganda-marked')) {
                return; // 父元素已經被標記，跳過
            }
            parent = parent.parentElement;
        }

        // 檢查子元素是否已經被標記，如果是，則跳過父元素
        const markedChildren = element.querySelectorAll('[data-propaganda-marked]');
        if (markedChildren.length > 0) {
            return;
        }

        // 添加到已標記集合
        markedElements.add(element);
        
        // 添加標記屬性
        element.setAttribute('data-propaganda-marked', 'true');
        element.classList.add('propaganda-marked');

        // 移除已存在的警告標籤
        const existingWarning = element.querySelector('.propaganda-warning');
        if (existingWarning) {
            existingWarning.remove();
        }

        // 創建警告標籤
        const warningLabel = document.createElement('div');
        warningLabel.className = 'propaganda-warning';
        warningLabel.textContent = `內含${matchedNames[0]}關鍵字，請小心`;
        warningLabel.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ff0000;
            color: white;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: bold;
            border-radius: 3px;
            z-index: 1000;
            pointer-events: none;
            max-width: 200px;
            word-wrap: break-word;
        `;

        // 設置父元素為相對定位
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        // 添加警告標籤
        element.appendChild(warningLabel);

        // 添加工具提示顯示匹配的廣告名稱
        element.title = `匹配的廣告名稱: ${matchedNames.join(', ')}`;
    }

})(); 