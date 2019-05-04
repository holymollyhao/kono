import sys
from time import sleep
from datetime import datetime
import json
import requests
import pymysql

#Connection to DB
conn = pymysql.connect(host='localhost', user='root', password='22pitch', 
	db='kono', charset='utf8')
sql = """INSERT INTO room(room_number, status, timestamp, duration) VALUES (%s, %s, %s, SEC_TO_TIME(%s))"""

time_acc = 1.0
door_threshold = 190
db_threshold = 401
#pir_threshold = 0.2
inpending_threshold = 10 #between song (30)
outpending_threshold = 5 #between session (10)
request_gap = 7

def _timestamp():
	return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def error_handling():
	pass
"""
def initialize(status, room_id):
	status[room_id] = {'history': [], 'sound': [], 'door': [],
						'session': {'use': 0, 'pending': 0, 'duration': 0}}
	return status

def door_check(response):
	sound = response['sound']
	door = response['door']
	door_set, pending = 0, 0

	for i in range(0, 10):
		if door[i] <= door_threshold:
			if sound[i] >= db_threshold:
				pending = 0
				continue
			door_set = 1
			pending += 1

	return door_set, pending

def sess_extend(status, rm):
	if status[rm]['session']['use'] == 0:
		status[rm]['session']['use'] = 1
	status[rm]['session']['duration'] += request_gap
	return status	

def judge(status, responses):
	# status = { room_id : {'history': [], 'sound': [], 'door': [],
	#						'session': {'use': 0 or 1, 'pending': int, 'duration': ~ sec}}
	for response in responses:
		rm = resposne['room_id']
		if rm not in status.keys():
			status = initialize(status, rm)
		history_info = status.get(rm, {})
		sound_set, door_set, pending = 0, 0, 0
		
		for i in range(0, 10):
			if door[i] <= door_threshold:
				if sound[i] >= db_threshold:
					pending = 0
					sound_set = 1
					#sess_extend(status, rm)
				elif np.mean(pir) >= pir_threshold
					pending += 1
					door_set = 1
					if pending 

		#pending check
		if history_info['session']['pending'] > 0:
			pass
		else:
			sound = response['sound']
			for i in range(0, 10):
				if sound[i] >= db_threshold:
					sound_set = 1
					sess_extend(status, rm)
					break
			
			if np.mean(pir) >= pir_threshold:
				sess_extend(status, rm)

			door_set, pending = door_check(response)
"""
def db_get():
	pass

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

def sess_close(status, rm):
	db_put(rm, status[rm])
	initialize(status, rm)

def judge(status, responses):
	# status = { room_id : {'sess': 0 or 1, 'in_pending': int, 'out_pending':int, 'duration': ~ sec}
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
					# New-session when singing song
					status[rm]['sess'] = 1

			# Session Control
			if status[rm]['in_pending'] > inpending_threshold or status[rm]['out_pending'] > outpending_threshold:
				sess_close(status, rm) # Close current session and put info in DB

			if status[rm]['sess'] == 1:
				status[rm]['duration'] += 1

		status[rm]['timestamp'] = response['timestamp']
		db_put(rm, status[rm])

def acc_test():
	pass

def _run():	
	status = {}
	url_list = ['http://localhost:8080']
	while True:
		responses = []
		for url in url_list:
			response = requests.get(url=url)
			if response.status_code != 500:
				responses.append(response.json())
		judge(status, responses)
		conn.commit()
		sleep(request_gap)

def run():
	try:
		_run()
	finally:
		print("Error")

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