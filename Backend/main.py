from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import os
from datetime import datetime
from database import db
from fastapi.responses import JSONResponse
from fastapi.requests import Request

print("🚀 Backend has started Kunjal")

app = FastAPI()
load_dotenv()
approved_users = set(os.getenv("APPROVED_USERS", "").lower().split(","))

@app.api_route("/", methods=["GET", "HEAD"])
def root(request: Request):
    return JSONResponse(content={"message": "API is working"})

# @app.get("/")
# def read_root():
#     return {"message": "API is working"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://lens-n-lore.vercel.app/"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

download_permissions = {}
IMAGES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "assets"))

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

@app.post("/api/contact")
async def save_contact(form: ContactForm):
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO forms_data (name, email, message) VALUES (%s, %s, %s)",
            (form.name, form.email, form.message)
        )
        db.commit()
        cursor.close()
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open("forms_data.txt", "a", encoding="utf-8") as f:
            f.write(f"--- New Form Data ({timestamp})---\n")
            f.write(f"Name   : {form.name}\n")
            f.write(f"Email  : {form.email}\n")
            f.write(f"Message: {form.message}\n")
            f.write(f"----------------------\n\n")

        return {"message": "Form submitted and saved successfully!"}
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": f"Internal Error: {str(e)}"}
    
class DownloadRequest(BaseModel):
    image: str
    user: str

@app.post("/api/request-download")
def request_download(data: DownloadRequest):
    try:
        user = data.user.strip().lower()
        image = data.image
        key = f"{user}_{image}"

        print("📥 Download request received:")
        print(f"📸 Image: {image}")
        print(f"🙋 User: {user}")

        is_allowed = user in approved_users

        if is_allowed:
            download_permissions[key] = True
        else:
            print(f"⛔ User '{user}' is not allowed to download.")

        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO download_requests (image, user, approved, requested_at) VALUES (%s, %s, %s, NOW())",
            (image, user, int(is_allowed))
        )
        db.commit()

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open("download_requests.txt", "a", encoding="utf-8") as f:
            f.write(f"--- Download Request ({timestamp}) ---\n")
            f.write(f"User    : {user}\n")
            f.write(f"Image   : {image}\n")
            f.write(f"Approved: {is_allowed}\n")
            f.write(f"-------------------------------\n\n")

        print("🗂️  Logged to MySQL and file successfully.")
        return {"allowed": is_allowed}

    except Exception as e:
        print("❌ SERVER ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/image/{image_name}")
def download_image(image_name: str, user: str):
    key = f"{user.strip().lower()}_{image_name}"

    if not download_permissions.get(key):
        print(f"⛔ Access denied for user '{user}' trying to download '{image_name}'")
        raise HTTPException(status_code=403, detail="Permission denied")

    image_path = os.path.join(IMAGES_DIR, image_name)
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_name}")
        raise HTTPException(status_code=404, detail="Image not found")

    print(f"✅ Image '{image_name}' successfully sent to user '{user}'")
    return FileResponse(image_path, filename=image_name)

# @app.get("/approve")
# def approve_download(user: str, image: str):
#     key = f"{user.strip().lower()}_{image}"
#     download_permissions[key] = True
#     try:
#         cursor = db.cursor()
#         cursor.execute(
#             "UPDATE download_requests SET approved = 1 WHERE user = %s AND image = %s",
#             (user, image)
#         )
#         db.commit()
#         print(f"✅ Approved: {user} for {image}")
#     except Exception as e:
#         print("❌ MySQL update failed on approval:", e)

#     return {"message": f"✅ Approved download for {user} - {image}"}

# @app.get("/deny")
# def deny_download(user: str, image: str):
#     try:
#         cursor = db.cursor()
#         cursor.execute(
#             "UPDATE download_requests SET approved = 0 WHERE user = %s AND image = %s",
#             (user, image)
#         )
#         db.commit()
#         print(f"❌ Denied: {user} for {image}")
#     except Exception as e:
#         print("❌ MySQL update failed on denial:", e)

#     return {"message": f"❌ Denied download for {user} - {image}"}
