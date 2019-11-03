import zmq
import cv2

context = zmq.Context()
print('connect to hello world server')
socket = context.socket(zmq.REQ)
socket.connect('tcp://10.141.5.104:5555')

source = "rtsp://admin:admin12345@10.141.5.141:554/mpeg4"
source2 = "rtsp://admin:admin12345@10.141.5.142:554/mpeg4"
cap = cv2.VideoCapture(source)
cap2 = cv2.VideoCapture(source2)
frameNo = 0
while (1):
    if cap.isOpened():
        (ret, frame) = cap.read()
    if cap2.isOpened():
        (ret2, frame2) = cap2.read()
    # cv2.imshow("frame",frame)
    # cv2.waitKey(10)
    # cv2.imshow("frame2",frame2)
    # cv2.waitKey(10)
    # cv2.imshow("frame3",frame3)
    # cv2.waitKey(10)

    frameNo = frameNo + 1
    if frameNo % 30 == 0:
        msg = {'state': 2}
        msg['images'] = [frame2]
        cv2.imshow('frame', frame2)
        socket.send_pyobj(msg)
        message = socket.recv_pyobj()
        print('305 Room:', message)
