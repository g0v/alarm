#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import json

def convert_csv_to_json():
    """將 CSV 檔案轉換為 JSON 格式"""
    
    # 讀取 CSV 檔案
    ad_names = []
    
    with open('all_tbls.xlsx - unique_ad_name.csv', 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # 只保留 ad_name 欄位，去除 id
            ad_names.append(row['ad_name'])
    
    # 寫入 JSON 檔案
    with open('ad_names.json', 'w', encoding='utf-8') as jsonfile:
        json.dump(ad_names, jsonfile, ensure_ascii=False, indent=2)
    
    print(f"已成功轉換 {len(ad_names)} 個廣告名稱到 ad_names.json")

if __name__ == "__main__":
    convert_csv_to_json() 