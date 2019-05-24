## kono-auth

An authentication server for kono

### 설치
```
$ git clone https://github.com/sparcs-kaist/kono.git
$ cd kono/kono-api
$ npm install
```
Dev-server 실행
```
$ npm run start:dev
```
Build
```
$ npm run build
```

### APIs
- GET /api/v1/room/state
    - response
        - 연결 성공
            - 200 OK
            - state: {room_number: int, status: int, timestamp: timestamp, duration: time}
            - 모든 방에 대한 state가 가장 최근 시간 기준으로 room_number 순서으로 반환된다.
        - 서버 에러
            - 500 Internal Server Error
