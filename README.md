# 外宣標記器

這是一個 Chrome 和 Firefox 瀏覽器擴充功能，用於自動標記搜尋引擎結果中可能的外宣內容。

Firefox 連結: https://addons.mozilla.org/zh-TW/firefox/addon/%E5%A4%96%E5%AE%A3%E6%A8%99%E8%A8%98%E5%99%A8/

Chrome 連結: (送審中)

## 功能特色

- 🔍 **自動檢測**：在搜尋引擎結果中自動檢測包含外宣機構名稱的網頁
- 🎯 **視覺標記**：將可疑內容標記為粉紅色背景和深紅色邊框
- ⚠️ **警告標籤**：在右上角顯示"請小心"警告標籤
- 🔄 **即時更新**：支援動態載入的內容，即時檢測新出現的搜尋結果
- 🌐 **多引擎支援**：支援 Google、Bing、Yahoo、百度等主流搜尋引擎

## 支援的搜尋引擎

- Google (google.com, google.com.tw)
- Bing (bing.com)
- Yahoo (yahoo.com, yahoo.com.tw)
- 百度 (baidu.com)
- 搜狗 (sogou.com)
- 360搜索 (360.cn)

## 安裝方法

### Chrome 瀏覽器

1. 下載或克隆此專案到本地
2. 打開 Chrome 瀏覽器，進入 `chrome://extensions/`
3. 開啟右上角的「開發人員模式」
4. 點擊「載入未封裝項目」
5. 選擇此專案的資料夾
6. 擴充功能安裝完成

### Firefox 瀏覽器

1. 下載或克隆此專案到本地
2. 打開 Firefox 瀏覽器，進入 `about:debugging`
3. 點擊「此 Firefox」
4. 點擊「載入暫時附加元件」
5. 選擇此專案中的 `manifest.json` 檔案
6. 擴充功能安裝完成

## 使用方法

1. 安裝擴充功能後，前往任何支援的搜尋引擎
2. 進行搜尋
3. 如果搜尋結果中包含外宣機構名稱，該結果會被自動標記：
   - 背景變為粉紅色
   - 邊框變為深紅色
   - 右上角顯示"請小心"警告標籤
4. 將滑鼠懸停在標記的結果上，可以看到匹配的具體機構名稱

## 資料來源

擴充功能使用的廣告名稱資料來自 `all_tbls.xlsx - unique_ad_name.csv` 檔案，包含超過 6000 個外宣相關的機構名稱。

## 檔案結構

```
├── manifest.json          # 擴充功能配置檔案
├── content.js             # 主要功能腳本
├── styles.css             # 樣式檔案
├── ad_names.json          # 廣告名稱資料（由 CSV 轉換而來）
├── icon16.png            # 16x16 圖示
├── icon48.png            # 48x48 圖示
├── icon128.png           # 128x128 圖示
├── convert_csv_to_json.py # CSV 轉 JSON 腳本
├── create_icons.py        # 圖示生成腳本
└── README.md             # 說明檔案
```

## 開發說明

### 更新廣告名稱資料

如果需要更新廣告名稱資料：

1. 更新 `all_tbls.xlsx - unique_ad_name.csv` 檔案
2. 執行轉換腳本：
   ```bash
   python3 convert_csv_to_json.py
   ```
3. 重新載入擴充功能

### 自訂樣式

可以修改 `styles.css` 檔案來自訂標記的視覺效果。

## 注意事項

- 此擴充功能僅供參考，標記結果不代表該網頁確實為外宣內容
- 建議結合其他資訊來源進行綜合判斷
- 擴充功能會定期掃描頁面，可能對效能有輕微影響

## 授權

此專案僅供教育和研究用途使用。

## 貢獻

歡迎提交 Issue 和 Pull Request 來改善此擴充功能。 