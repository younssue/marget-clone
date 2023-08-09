from fastapi import FastAPI, UploadFile, Form, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from fastapi_login import LoginManager
from fastapi_login.exceptions import InvalidCredentialsException
from typing import Annotated
import sqlite3

# db연결
con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

# 테이블이 없을 때 생성해주기
cur.execute(f"""
            CREATE TABLE IF NOT EXISTS items (
	            id INTEGER PRIMARY KEY,
	            title TEXT NOT NULL,
	            image BLOB,
	            price INTEGER NOT NULL,
	            description TEXT,
	            place TEXT NOT NULL,
	            insertAt INTEGER NOT NULL
            );
            """)

app = FastAPI()

# 로그인 할 때 access_token 생성
SECRET = 'super-coding'
manager = LoginManager(SECRET, '/login')

# 회원을 db에서 조회

# data형식이 dict이라면 그 중 id값은 data['id']라고 명시를 해줘야함


@manager.user_loader()
def query_user(data):
    WHERE_STATEMENTS = f'id="{data}"'
    if type(data) == dict:
        WHERE_STATEMENTS = f'''id="{data['id']}"'''
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    user = cur.execute(f"""
                      SELECT * FROM users WHERE {WHERE_STATEMENTS}
                      """).fetchone()

    return user

# 로그인 기능


@app.post('/login')
def login(id: Annotated[str, Form()],
          password: Annotated[str, Form()]):
    user = query_user(id)
    # print(user['password'])
    if not user:
        # 로그인 실패 시 에러메세지 보내기
        # 로그인 실패시 401
        raise InvalidCredentialsException
    elif password != user['password']:

        raise InvalidCredentialsException

    # 로그인 성공 시 200
    # JWT 로 변환해서 서버로 보내줌
    # JWT 사이트에 들어가서 보면,jwt access_token 값으로 받고,그걸로 변환하면 보낸 값을 볼 수 있음

    access_token = manager.create_access_token(data={

        'sub': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
        }
    })

    return {'access_token': access_token}


# 회원가입


@app.post('/signup')
def singup(id: Annotated[str, Form()],
           password: Annotated[str, Form()],
           name: Annotated[str, Form()],
           email: Annotated[str, Form()]
           ):

    cur.execute(f"""
                INSERT INTO users(id,name,email,password)
                VALUES ('{id}','{name}','{email}','{password}')
                """)
    con.commit()
    return '200'


# 글작성 -> 디비 저장


@app.post("/items")
async def create_item(image: UploadFile,
                      title: Annotated[str, Form()],
                      price: Annotated[int, Form()],
                      description: Annotated[str, Form()],
                      place: Annotated[str, Form()],
                      insertAt: Annotated[int, Form()],
                      user=Depends(manager)
                      ):

    # image 를 byte로 바꿔서 저장
    image_bytes = await image.read()
    # f열 문자열 쓰는 방법
    # sql문 작성을 f열 안에 넣음
    # image_bytes.hex(): hex() 16진법으로 변경
    cur.execute(f"""
                INSERT INTO items(title,image,price,description,place,insertAt) 
                VALUES('{title}','{image_bytes.hex()}',{price},'{description}','{place}',{insertAt})
                """)
    con.commit()
    # print(image, title, price, description, place)
    return '200'


# 글 목록 불러오기
# user=Depends(manager): 유저가 인증이 된 상태에서만 응답을 보낼 수 있게 한다

@app.get('/items')
async def get_items(user=Depends(manager)):
    # 데이터만 쭈욱 가져오는 것이 아닌, 칼럼명과 함께 가져옴 {id:1, title:운동화..}
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                       SELECT * FROM items;
                       """).fetchall()

    # rows =[ ['id':1],['title':운동화]... ]
    # dict(row) for row in rows = {id:1, title:운동화..}
    return JSONResponse(jsonable_encoder(dict(row) for row in rows))


@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    # 16진법 상태
    image_bytes = cur.execute(f"""
                             SELECT image FROM items WHERE id={item_id}
                             """).fetchone()[0]
    # 16진법으로 된 값을 가져와서 다시 바이트로
    return Response(content=bytes.fromhex(image_bytes), media_type='image/*')


app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
