import math

print("質數判斷\n輸入0結束")

while True:
    # 詢問
    user_input = input("\n你要問的數: ")
    # 退出
    if user_input == '0':
        print("\n行")
        break
    try:
        num = int(user_input)
    except ValueError:
        print("非整數")
        continue
    # 判斷小2等2大2
    if num < 2:
        print(f"{num} 不是")
    elif num == 2:
        print(f"{num} 是")
    elif num % 2 == 0:  # 整除
        print(f"{num} 不是")
    else:
        # 平方轉整
        limit = int(math.sqrt(num))
        # 預設是質數
        is_prime = True
        # 迴圈
        for i in range(3, limit + 1, 2):
            # 可以整除
            if num % i == 0:
                is_prime = False
                break # 停止迴圈
        # 輸出
        if is_prime:
            print(f"{num} 是")
        else:
            print(f"{num} 不")