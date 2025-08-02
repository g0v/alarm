#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import zipfile
import os
import shutil

def package_extension():
    """將擴充功能打包成 ZIP 檔案"""
    
    # 需要包含的檔案
    files_to_include = [
        'manifest.json',
        'content.js',
        'styles.css',
        'ad_names.json',
        'icon16.png',
        'icon48.png',
        'icon128.png',
        'README.md'
    ]
    
    # 建立 ZIP 檔案
    zip_filename = 'propaganda_marker_extension.zip'
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_include:
            if os.path.exists(file):
                zipf.write(file)
                print(f"已添加: {file}")
            else:
                print(f"警告: 找不到檔案 {file}")
    
    print(f"\n擴充功能已打包完成: {zip_filename}")
    print(f"檔案大小: {os.path.getsize(zip_filename) / 1024:.1f} KB")

def create_dist_folder():
    """建立發佈資料夾"""
    dist_folder = 'dist'
    
    if os.path.exists(dist_folder):
        shutil.rmtree(dist_folder)
    
    os.makedirs(dist_folder)
    
    # 複製檔案到 dist 資料夾
    files_to_copy = [
        'manifest.json',
        'content.js',
        'styles.css',
        'ad_names.json',
        'icon16.png',
        'icon48.png',
        'icon128.png',
        'README.md'
    ]
    
    for file in files_to_copy:
        if os.path.exists(file):
            shutil.copy2(file, dist_folder)
            print(f"已複製: {file}")
    
    print(f"\n發佈資料夾已建立: {dist_folder}/")

if __name__ == "__main__":
    print("正在打包擴充功能...")
    package_extension()
    
    print("\n正在建立發佈資料夾...")
    create_dist_folder()
    
    print("\n完成！您可以：")
    print("1. 使用 propaganda_marker_extension.zip 檔案")
    print("2. 或使用 dist/ 資料夾來載入擴充功能") 