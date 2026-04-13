import pandas as pd
from facebook_scraper import get_posts
import time
import argparse

def crawl_facebook_page(page_name, num_pages, cookies_file=None):
    print(f"Bắt đầu crawl dữ liệu từ page: {page_name}")
    posts = []
    
    try:
        # get_posts trả về một generator, mỗi page lấy khoảng 20 bài
        for post in get_posts(page_name, pages=num_pages, cookies=cookies_file, extra_info=True):
            print(f"Đã lấy bài viết: {post.get('post_id')} - Thời gian: {post.get('time')}")
            
            # Trích xuất các trường thông tin quan trọng
            post_data = {
                'post_id': post.get('post_id'),
                'time': post.get('time'),
                'text': post.get('text'),
                'post_url': post.get('post_url'),
                'likes': post.get('likes'),
                'comments': post.get('comments'),
                'shares': post.get('shares'),
                'reaction_count': post.get('reaction_count'),
                'image': post.get('image'),
                'video': post.get('video')
            }
            posts.append(post_data)
            time.sleep(1) # Nghỉ 1 chút để tránh bị FB chặn do request quá nhanh
            
    except Exception as e:
        print(f"Đã xảy ra lỗi trong quá trình lấy dữ liệu: {e}")
        print("LƯU Ý: Nếu bị lỗi 'HTTPError: 404' hoặc 'Login required', vui lòng làm theo hướng dẫn trong file README.md để lấy file cookies.txt.")
        
    if not posts:
        print("Không lấy được bài viết nào. Cần thêm file cookies.txt để xác thực tài khoản.")
        return
        
    # Chuyển dữ liệu sang DataFrame và lưu thành file CSV
    df = pd.DataFrame(posts)
    output_filename = f"{page_name}_data.csv"
    df.to_csv(output_filename, index=False, encoding='utf-8-sig')
    print(f"\nHoàn thành! Đã lưu {len(posts)} bài viết vào file {output_filename}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Công cụ crawl dữ liệu từ Facebook Fanpage.')
    parser.add_argument('page_name', type=str, help='Tên đường dẫn của Fanpage (Ví dụ: thankinhtrading)')
    parser.add_argument('--pages', type=int, default=1, help='Số lượng trang cần lặp qua (1 trang ~ khoảng 5-20 bài viết)')
    parser.add_argument('--cookies', type=str, default=None, help='Đường dẫn đến file cookies.txt (Rất quan trọng để tránh bị chặn)')
    
    args = parser.parse_args()
    
    crawl_facebook_page(args.page_name, args.pages, args.cookies)
