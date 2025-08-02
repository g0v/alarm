#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """創建簡單的圖示"""
    # 創建圖片
    img = Image.new('RGBA', (size, size), (255, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    
    # 繪製警告標誌
    margin = size // 4
    draw.rectangle([margin, margin, size - margin, size - margin], 
                  outline=(255, 255, 255, 255), width=3)
    
    # 繪製 X 符號
    draw.line([margin + 5, margin + 5, size - margin - 5, size - margin - 5], 
              fill=(255, 255, 255, 255), width=3)
    draw.line([size - margin - 5, margin + 5, margin + 5, size - margin - 5], 
              fill=(255, 255, 255, 255), width=3)
    
    # 保存圖片
    img.save(filename, 'PNG')
    print(f"已創建圖示: {filename}")

def main():
    """創建所有尺寸的圖示"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        filename = f"icon{size}.png"
        create_icon(size, filename)

if __name__ == "__main__":
    main() 