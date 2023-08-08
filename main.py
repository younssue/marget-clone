from fastapi import FastAPI, UploadFile, Form, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from typing import Annotated
import sqlite3

# db연결
con = sqlite3.connect('db.db', check_same_thread=False)
cur = con.cursor()

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

# 글작성 -> 디비 저장


@app.post("/items")
async def create_item(image: UploadFile,
                      title: Annotated[str, Form()],
                      price: Annotated[int, Form()],
                      description: Annotated[str, Form()],
                      place: Annotated[str, Form()],
                      insertAt: Annotated[int, Form()]
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


@app.get('/items')
async def get_items():
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
    return Response(content=bytes.fromhex(image_bytes))

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
