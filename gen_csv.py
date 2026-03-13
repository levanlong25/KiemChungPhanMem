import csv

# Tên file và tiêu đề (phải khớp với biến trong Postman)
filename = "users_data.csv"
header = ['email_username', 'password']

with open(filename, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(header) # Ghi dòng tiêu đề
    
    # Tạo 100 dòng dữ liệu khớp với lệnh seed-test-members bạn vừa làm
    for i in range(1, 101):
        writer.writerow([f"tester_ev_{i}", "Password123!"])

print(f"===> Xong! Đã tạo file {filename} với 100 tài khoản.")