from fastapi import FastAPI, Request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import random
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
    customer_id = random.randint(0,1000) 
    email = f"{customer_first_name}.{customer_last_name}@sakilacustomer.org"
    store_id = 1
    address_id = 1
    rental_date = datetime.now()
    due_date = rental_date + timedelta(days=data['rental_period'])
    films_not_available = []
    films_available = []
    film_inventory = 0
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    print(film_names)
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

            result = session.execute(query, {"film_names": name}).first()

            if result:
                film_inventory = result[1]
                print(film_inventory)
                if film_inventory > 0:
                    films_available.append(name)
                else:
                    films_not_available.append(name)
            else:
                films_not_available.append(name)

            query_film_id = text("""
                                SELECT film_id
                                FROM film
                                WHERE title = :film_name
            """)
            result_film_id = session.execute(query_film_id, {"film_name": name})
            film_id_row = result_film_id.fetchone()
            print(film_id_row)
            if film_id_row:
                film_id = film_id_row[0]
        
                # Insert rental record for the film
                query_insert_rental = text("""
                                            INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id, return_date)
                                            SELECT
                                                NOW(),
                                                i.inventory_id,
                                                :customer_id,
                                                1,
                                                :due_date
                                            FROM
                                                inventory i
                                            LEFT JOIN
                                                rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
                                            WHERE
                                                i.film_id = :film_id
                                                AND r.inventory_id IS NULL
                                            LIMIT 1
        """)
        session.execute(query_insert_rental, {"film_id": film_id, "customer_id": customer_id,"due_date":due_date})


        session.commit()
        confirmation_message = f"New customer {customer_first_name} {customer_last_name} has been successfully added to the database.\n"
        if films_available:
            confirmation_message += f"The following film(s) have been rented: \n{', '.join(films_available)}.\n"
        if films_not_available:
            confirmation_message += f"The following film(s) are not in stock: \n{', '.join(films_not_available)}.\n"
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
