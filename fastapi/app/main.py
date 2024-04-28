from fastapi import FastAPI, Request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "mysql+mysqlconnector://root:supersecretpassw0rd@mysql/sakila"


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Howdy"}


@app.post("/rental")
async def rental(request: Request):
    data = await request.json()
    customer_first_name = data['firstName']
    customer_last_name = data['lastName']
    videos = data['videos']

    rental_date = datetime.now()
    due_date = rental_date + timedelta(days=data['rental_period'])

    confirmation_message = f"New customer {customer_first_name} {customer_last_name} has successfully rented\n {videos}.\n"
    confirmation_message += f"Due date: {due_date.strftime('%Y-%m-%d')} \nStaff ID: {data['staff_id']}"

    return JSONResponse(content={"message": confirmation_message})


@app.get("/getCanadianCustomers")
def getCanadianCustomers():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = SessionLocal()
    try:
        result = session.execute(text("""
            SELECT customer.first_name, customer.last_name, customer.email, city.city
            FROM customer
            JOIN address ON customer.address_id = address.address_id
            JOIN city ON address.city_id = city.city_id
            JOIN country ON city.country_id = country.country_id
            WHERE country.country = 'Canada'
            ORDER BY city.city
        """))
        customers = [{"first_name": row[0], "last_name": row[1],
                      "email": row[2], "city": row[3]} for row in result]
        return customers
    finally:
        session.close()


@app.get("/getAmericanCustomers")
def getAmericanCustomers():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = SessionLocal()
    try:
        result = session.execute(text("""
            SELECT city.city, COUNT(*) as customer_count
            FROM customer
            JOIN address ON customer.address_id = address.address_id
            JOIN city ON address.city_id = city.city_id
            JOIN country ON city.country_id = country.country_id
            WHERE country.country = 'United States'
            GROUP BY city.city
            ORDER BY COUNT(*) DESC
        """))
        customers = [{"city": row.city, "customer_count": row.customer_count}
                     for row in result]
        print(customers)
        return customers
    finally:
        session.close()
