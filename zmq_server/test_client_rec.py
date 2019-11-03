import zmq
import cv2
import matplotlib.pyplot as plt
import numpy as np
import skimage.io

context = zmq.Context()
print('connect to hello world server')
socket = context.socket(zmq.REQ)
socket.connect('tcp://10.141.5.104:5555')


cap = cv2.VideoCapture("./out.avi")
flag = 0
while cap.isOpened():
    ret, frame = cap.read()
    if flag % 10 == 0:
        msg = {'state': 2}
        msg['images'] = [frame]
        socket.send_pyobj(msg)
        print(socket.recv_pyobj())

