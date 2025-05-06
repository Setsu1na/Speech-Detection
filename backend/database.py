import datetime

# 模拟数据库存储用户声纹
simulated_user_db = {}

def save_user_registration(user_id, filepath, embedding_list):
    """模拟保存用户注册信息（可选）"""
    # 实际应用可能需要更复杂的表结构
    print(f"Simulating saving registration info for user {user_id}")
    if user_id not in simulated_user_db:
        simulated_user_db[user_id] = {"registrations": [], "embedding": None}
    simulated_user_db[user_id]["registrations"].append({
        "filepath": filepath,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    })
    # 通常注册需要多次语音，这里简化为最后一次覆盖
    simulated_user_db[user_id]["embedding"] = embedding_list
    return True

def register_embedding(user_id, embedding_list):
    """模拟在数据库中注册或更新用户的声纹 embedding"""
    print(f"Simulating registering embedding for user {user_id}")
    if user_id not in simulated_user_db:
         simulated_user_db[user_id] = {"registrations": [], "embedding": None}
    simulated_user_db[user_id]["embedding"] = embedding_list
    return True

def get_user_embedding(user_id):
    """模拟从数据库获取用户的注册声纹 embedding"""
    print(f"Simulating fetching embedding for user {user_id}")
    user_data = simulated_user_db.get(user_id)
    if user_data and user_data.get("embedding"):
        return user_data["embedding"]
    return None

def get_user_registrations(user_id):
    """模拟获取用户所有的注册记录（可选）"""
    user_data = simulated_user_db.get(user_id)
    if user_data:
        return user_data.get("registrations", [])
    return [] 