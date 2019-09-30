
import serial
import sys
import time

global serialRef
port = "/dev/ttyACM0"
rate = 9600

message = 'msg' + sys.argv[1]

def sendMessage(msg):
        time.sleep(3)
        serialRef.write(msg.encode())

try:
        print("el mensaje a enviar es ", message)
        serialRef = serial.Serial(port, rate)
#       serialRef.flushInput()
        sendMessage(message)
except Exception as e:
        print("An exception occurred", e)
        sys.exit()
finally:
        print("SALIR DE LA APLICACION")
        sys.exit()
