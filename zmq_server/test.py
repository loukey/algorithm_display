import pymongo
import zmq
# 10.141.5.104
import cv2
from ping3 import ping, verbose_ping
from utils import network_state


mongodb = pymongo.MongoClient('mongodb://localhost:27017')
mydb = mongodb['person_search']
camera_log = mydb['camera_log']
# camera_log.delete_many({"camera_ip":"10.141.5.141"})

# log = {
#     "camera_ip":"10.141.5.141",
#     "time": "2019-10-24-12-33-16",
#     "position": "小门",
#     "department": "人事部",
#     "person": "蒋龙泉",
# }

# ip_lists.delete_one({"type": "reid"} )
# camera_log.insert_one(log)

# x = camera_log.delete_many({})
# print(x.deleted_count)

for log in camera_log.find():
    print(log)
    # result.append([
    #     camera["ip"],
    #     camera["name"],
    #     camera["position"],
    #     camera["type"],
    # ])