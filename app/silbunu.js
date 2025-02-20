// from fastapi import FastAPI
// from fastapi.staticfiles import StaticFiles
// from fastapi.middleware.cors import CORSMiddleware
// from mangum import Mangum
// from app.api.api import router as api_router
// import os
// import logging

// logging.basicConfig()
// logging.getLogger("sqlalchemy.engine").setLevel(logging.DEBUG)

// IMAGE_SERVE_DIR = "app/api/database/images"
// DOCUMENT_SERVE_DIR = "app/api/database/documents"

// app = FastAPI()

// # Add CORS Middleware
// app.add_middleware(
//     CORSMiddleware,
//     allow_origins=[
//         "https://uskumenzade.vicir.dev",  # Production frontend
//         "http://localhost:3000"           # Local development frontend
//     ],
//     allow_credentials=True,
//     allow_methods=["*"],
//     allow_headers=["*"],
// )

// # Create the directory if it doesn't exist
// os.makedirs(IMAGE_SERVE_DIR, exist_ok=True)

// # Mount the directory to serve static images and documents
// app.mount("/uskumenzade/api/static/images", StaticFiles(directory=IMAGE_SERVE_DIR), name="images")
// app.mount("/uskumenzade/api/static/documents", StaticFiles(directory=DOCUMENT_SERVE_DIR), name="documents")

// @app.get("/")
// async def root():
//     return {"message": "Hello World"}

// app.include_router(api_router, prefix="/uskumenzade/api")
// handler = Mangum(app)
