
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# db = ""
client = MongoClient("mongodb+srv://raghavagarwal3050:CodeRed123@cluster0.rbyukfa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.curd

# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)