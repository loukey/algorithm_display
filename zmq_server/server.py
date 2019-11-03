import zmq
import time
from threading import Thread, Lock
from utils import *
import pymongo
import os
import cv2


class Server:

    def __init__(self, ip_address):
        self.ip_address = ip_address
        self.sender = Sender(self.ip_address)
        self.listener = Listener(self.ip_address)
        self.ping()

    def ping(self):
        network = network_state(self.ip_address)
        print("the ping of ip: {0} is {1}".format(self.ip_address, network))
        if network != 9999:
            self.sender.set_network(network)
            self.sender.start()
            self.listener.start()
        else:
            time.sleep(5)


def get_camera():
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    camera_list = mydb['camera_list']
    result = []
    for camera in camera_list.find():
        result.append([camera["ip"], camera["name"], camera["position"], camera["type"]])
    return result


def delete_camera(ip):
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    camera_list = mydb['camera_list']
    camera_list.delete_one({"ip": str(ip).strip(" ")})


def get_ip():
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    ip_lists = mydb['ip_lists']
    result = []
    for ip_list in ip_lists.find():
        result.append([ip_list["type"], ip_list["ip"], ip_list["port"]])
    return result


def change_ip(reid_ip, face_ip):
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    ip_lists = mydb['ip_lists']
    reid_list = {
        "type": "reid",
        "ip": reid_ip["ip"],
        "port": reid_ip["port"],
    }
    face_list = {
        "type": "face",
        "ip": face_ip["ip"],
        "port": face_ip["port"],
    }
    ip_lists.delete_one({"type": "reid"})
    ip_lists.insert_one(reid_list)
    ip_lists.delete_one({"type": "face"})
    ip_lists.insert_one(face_list)


def get_people():
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    people = mydb['people_list']
    result = []
    for person in people.find():
        result.append([person["name"], person["sex"], person["department"]])
    return result


def add_person(person):
    insert_person = {
        "name": person["name"],
        "sex": person["sex"],
        "department": person["department"],
    }
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    people = mydb['people_list']
    people.insert_one(insert_person)


def delete_person(name):
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    people = mydb['people_list']
    person = people.find_one({"name": str(name).strip(" ")})
    if os.path.exists("../img/upload_img/face/{0}_{1}_{2}.jpg".format(person["name"], person["sex"], person["department"])):
        os.remove("../img/upload_img/face/{0}_{1}_{2}.jpg".format(person["name"], person["sex"], person["department"]))
    if os.path.exists("../img/upload_img/reid/{0}_{1}_{2}.jpg".format(person["name"], person["sex"], person["department"])):
        os.remove("../img/upload_img/reid/{0}_{1}_{2}.jpg".format(person["name"], person["sex"], person["department"]))
    people.delete_one({"name": str(name).strip(" ")})


def capture_log():
    result = []
    mongodb = pymongo.MongoClient('mongodb://localhost:27017')
    mydb = mongodb['person_search']
    camera_log = mydb['camera_log']
    for log in camera_log.find():
        result.append([log["time"], log["position"], log["department"], log["person"], log["camera_ip"]])
    return result


class Sender(Thread):

    def __init__(self, ip_address):
        super(Sender, self).__init__()
        self.network = 9999
        self.ip_address = ip_address

    def set_network(self, network):
        self.network = network

    def run(self) -> None:
        while self.network == 9999:
            time.sleep(2)
        while True:
            context = zmq.Context()
            socket = context.socket(zmq.REP)
            socket.bind("tcp://*:3001")
            message = dict(socket.recv_json())
            print(message)
            if message["head"] == "camera_register":
                register = Register(message)
                register.start()
            elif message["head"] == "get_camera":
                camera_list = get_camera()
                socket.send_json({
                    "camera_list": camera_list,
                })
            elif message["head"] == "delete_camera":
                delete_camera(message["ip"])
            elif message["head"] == "get_ip":
                ip_lists = get_ip()
                socket.send_json({
                    "ip_lists": ip_lists,
                })
            elif message["head"] == "change_ip":
                change_ip(message["reid"], message["face"])
            elif message["head"] == "get_people":
                people_list = get_people()
                socket.send_json({
                    "people_list": people_list
                })
            elif message["head"] == "add_person":
                add_person(message)
            elif message["head"] == "delete_person":
                delete_person(message["name"])
            elif message["head"] == "capture_log":
                result = capture_log()
                print(result)
                socket.send_json({
                    "capture_log": result
                })
            elif message["head"] == "get_state":
                length = message["length"]
                msg = {"length": length}
                for i in range(1, length + 1):
                    ip = message["camera" + str(i)]["ip"]
                    name = message["camera" + str(i)]["name"]
                    position = message["camera" + str(i)]["position"]
                    if network_state(ip) != 9999:
                        msg.update({
                            "camera" + str(i):{
                                "name": name,
                                "position": position,
                                "open": "true"
                            }
                        })
                    else:
                        msg.update({
                            "camera" + str(i): {
                                "name": name,
                                "position": position,
                                "open": "false"
                            }
                        })
                print(msg)
                socket.send_json(msg)
            socket.close()


class Register(Thread):

    def __init__(self, message):
        super(Register, self).__init__()
        self.message = message

    def run(self) -> None:
        mongodb = pymongo.MongoClient('mongodb://localhost:27017')
        mydb = mongodb['person_search']
        camera_list = mydb['camera_list']
        camera = {
            "ip": self.message["camera_ip"],
            "name": self.message["camera_name"],
            "position": self.message["camera_position"],
            "type": self.message["predict_type"]
        }
        camera_list.insert_one(camera)
        print("insert successfully")


class Listener(Thread):

    def __init__(self, ip_address):
        super(Listener, self).__init__()
        self.ip_address = ip_address

    def run(self) -> None:
        while True:
            context = zmq.Context()
            socket = context.socket(zmq.REP)
            socket.bind("tcp://*:5589")
            message = dict(socket.recv_json())
            print("[5589] receive message: {}".format(message))
            # todo: process checksum
            if message["head"] == "status":
                sys_status = sys_status()
                response_msg = {
                    "head": "rec_status",
                    "status": sys_status,
                }
                socket.send_json(response_msg)
                print("[5589]send message: {}".format(response_msg))


server = Server('127.0.0.1')
