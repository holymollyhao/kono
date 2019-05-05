import sys
from time import sleep
from datetime import datetime
import json
import requests
import pymysql

#Connection to DB
conn = pymysql.connect(host='localhost', user='root', password='password', 
	db='kono', charset='utf8')
sql = """INSERT INTO room(room_number, status, timestamp, duration) VALUES (%s, %s, %s, SEC_TO_TIME(%s))"""

time_acc = 1.0
door_threshold = 190
db_threshold = 401
inpending_threshold = 10 / time_acc #between song (30)
outpending_threshold = 5 / time_acc #between session (10)
request_gap = 7

def _timestamp():
	return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def error_handling(ip, error_code):
	print("Network from %s Error code %s", ip, error_code)

def db_put(rm, _status):
	try:
		with conn.cursor() as curs:
			curs.execute(sql, (rm, _status['sess'], _timestamp(), _status['duration']))
	except:
		conn.close()

def initialize(status, rm):
	status[rm] = {'sess': 0, 'in_pending': 0, 'out_pending': 0, 'duration': 0}

def _inpending(status, rm, pir):
	if pir == 0:
		status[rm]['in_pending'] += 1
	else:
		status[rm]['in_pending'] = 0

def _outpending(status, rm, door):
	if float(door) <= door_threshold:
		status[rm]['out_pending'] += 1
	else:
		status[rm]['out_pending'] = 0

def sess_start(status, rm):
	status[rm]['sess'] = 1

def sess_extend(status, rm):
	status[rm]['duration'] += 1

def sess_close(status, rm):
	db_put(rm, status[rm])
	initialize(status, rm)

def judge(status, responses):
	# status = { room_id : {'sess': 0 or 1, 'in_pending': int, 'out_pending':int, 'duration': int(sec)}
	#			 timestamp : ~}
	for response in responses:
		rm = response['room_id']
		status.setdefault(rm, {'sess': 0, 'in_pending': 0, 'out_pending': 0, 'duration': 0, 'timestamp': 0})
		curr_length = len(response['supersonic'])
		restart = min(curr_length, int(response['timestamp'] / 1000.) - int(status[rm]['timestamp'] / 1000.))

		door = response['supersonic'][-restart:]
		sound = response['sound'][-restart:]
		pir = response['pir'][-restart:]
		
		for i in range(0, len(door)):
			# Pending Update
			if status[rm]['sess'] == 1:
				if sound[i] < db_threshold:
					_inpending(status, rm, pir[i])
					_outpending(status, rm, door[i])
				else:
					status[rm]['in_pending'], status[rm]['out_pending'] = 0, 0
			else:
				if sound[i] >= db_threshold:
					sess_start(status, rm)

			# Session Control
			if status[rm]['in_pending'] > inpending_threshold or status[rm]['out_pending'] > outpending_threshold:
				sess_close(status, rm) # Close current session and put info in DB

			if status[rm]['sess'] == 1:
				sess_extend(status, rm)

		status[rm]['timestamp'] = response['timestamp']
		db_put(rm, status[rm])

def _run():	
	status = {}
	url_list = ['http://localhost:8080']
	while True:
		responses = []
		for url in url_list:
			response = requests.get(url=url)
			if response.status_code != 500:
				responses.append(response.json())
			else:
				error_handling(url, response.status_code)
		judge(status, responses)
		conn.commit()
		sleep(request_gap)

def run():
	try:
		_run()
	except:
		print("Error in run()")

def test():
	status = {}
	url_list = ['http://localhost:8080']
	while True:
		responses = []
		for url in url_list:
			response = requests.get(url=url)
			if response.status_code != 500:
				responses.append(response.json())
		print(responses)
		judge(status, responses)
		conn.commit()
		print(status)
		sleep(request_gap)

if __name__ == '__main__':
	if sys.argv[1] == 'run':
		run()
	if sys.argv[1] == 'test':
		test()