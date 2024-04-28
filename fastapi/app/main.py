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
    customer_first_name = data['firstName'].upper()
    customer_last_name = data["lastName"].upper()
    film_names = data['videos']
    customer_id = int(datetime.now().timestamp())
    email = f"{customer_first_name}.{customer_last_name}@sakilacustomer.org"
    store_id = 1
    address_id = 1
    print(film_names)
    rental_date = datetime.now()
    due_date = rental_date + timedelta(days=data['rental_period'])

    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    try:
        # Add new customer
        query = text("""
                INSERT INTO customer (store_id, first_name, last_name, email, address_id, create_date)
                VALUES (:store_id, :first_name, :last_name, :email, :address_id, NOW())
            """)

        session.execute(
            query, {
                "store_id": store_id,
                "first_name": customer_first_name,
                "last_name": customer_last_name,
                "email": email,
                "address_id": address_id,
            })

        for name in film_names:
            # Check if all selected films have available inventory
            query = text("""
                    SELECT f.film_id, COUNT(*) AS available_inventory
                    FROM film f
                    JOIN inventory i ON f.film_id = i.film_id
                    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
                    WHERE f.title = :film_names
                    GROUP BY f.film_id
            """)

            result = session.execute(query, {"film_names": name})
            film_inventory = {row[0]: row[1] for row in result}

        for film_id in film_inventory:
            if film_inventory[film_id] == 0:
                raise ValueError(
                    f"Film '{film_names[film_id]}' is not available in stock")

        # Perform the rental transaction
        for film_id in film_inventory:
            query = text("""
                INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id, return_date)
                VALUES (NOW(),
                        (SELECT inventory_id FROM inventory WHERE film_id = :film_id AND inventory_id NOT IN
                            (SELECT inventory_id FROM rental WHERE return_date IS NULL)),
                        :customer_id, 1, DATE_ADD(NOW(), INTERVAL 5 DAY))
            """)
            session.execute(query, {"film_id": film_id,
                            "customer_id": customer_id})

        session.commit()
        confirmation_message = f"New customer {customer_first_name} {customer_last_name} has successfully added to the database\n and rented {film_names}.\n"
        confirmation_message += f"Due date: {due_date.strftime('%Y-%m-%d')} \nStaff ID: {data['staff_id']}"

        return JSONResponse(content={"message": confirmation_message})
    finally:
        session.close()


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
