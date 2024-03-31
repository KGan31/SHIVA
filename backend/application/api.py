from flask import current_app as app,request,jsonify,Response
from flask_restful import  Resource, fields, marshal_with, reqparse
import json
from database import db
from main import api 
import os 
from werkzeug.security import generate_password_hash, check_password_hash
import os
from pyannote.audio import Model, Inference
from utils import calculate_similarity 
from langchain.memory import MongoDBChatMessageHistory
from io import BytesIO
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent
from langchain.agents.agent_types import AgentType
from langchain.memory import ConversationBufferMemory
from tools import run_terminal_command,search_tool , CurrentDateTimeTool , SaveUserEmailTool , wikipedia_tool, SendEmailTool , ReadEmailTool , SendEmailTool2 , getCalenderEventsTool
from langchain.chains import LLMMathChain, LLMChain
from langchain.tools import Tool 
import os 
from langchain_mongodb import MongoDBChatMessageHistory
import speech_recognition as sr

import hashlib

# message_context_args = {
#     "description",
#     "top_3_locations" , 
#     "recommended_time" , 
#     "hot_topics"
    
# }

register_args = {
    "username",
    "password",
    "fname",
    "lname",
    "email"
    
}

login_args = { 
    "username",
    "password"
}


message_context_args = {
    "username",
    "session_id",
    "message" , 
    
}



class RegisterAPI(Resource):
    def post(self):
        print(request.form)
        for arg in request.form:
            
            if arg not in register_args:
                return "Invalid JSON",400
        print(request.form)

        # Extract required fields from the request data
        username = request.form['username']
        fname = request.form['fname']
        lname = request.form['lname']
        password = request.form['password']


        # Check if username or password is missing
        
        # add_comment("1", "jddj","w@gmail.com")
        # Check if the username already exists
        if db.users.find_one({'username': username}):
            res = {'message': 'Username already exists'}
            return Response(json.dumps(res),status=400)    
            

        # Hash the password before storing it
        hashed_password = generate_password_hash(password)

        # Create a new user document
        new_user = {
            'username': username,
            'fname':fname,
            'lname':lname,
            'password': hashed_password
        }
        print(new_user)
        f = request.files['audio']
        print(f.filename)
        f.save(f'./user_audio_files/{username}.mp3')
        # # Insert the new user into the database
        db.users.insert_one(new_user)

        final_res = {
            'message':"succesfully registered"
            }
        
        print(final_res)
        return Response(json.dumps(final_res),status=200)        


class LoginAPI(Resource):
    def post(self):
        data = request.get_json()

        # Extract required fields from the request data
        username = data.get('username')
        password = data.get('password')

        # Check if username or password is missing
        if not username or not password:
            return Response(json.dumps({'message': 'Username and password are required'}),status=400)

        # Find the user in the database
        user = db.users.find_one({'username': username})

        # Check if user exists and password is correct
        if user and check_password_hash(user['password'], password):
            return Response(json.dumps({'message': 'Login successful'}),status=200)
        else:
            return Response(json.dumps({'message': 'Invalid username or password'}),status=400)


class Voice_Identification_API(Resource):
    def post(self):
        model = Model.from_pretrained("pyannote/embedding", use_auth_token="")

        inference = Inference(model, window="whole")

        

        # Get the embedding for the test audio
        
        embedding1 = inference(BytesIO(request.files['audio'].read()))


        # Specify the folder containing audio files for comparison
        audio_folder = "user_audio_files"

        # Initialize variables to track maximum similarity and speaker name
        max_similarity = 0.0
        most_similar_speaker = None

        # Iterate through all WAV files in the audio folder
        for filename in os.listdir(audio_folder):
            if filename.endswith(".wav"):
                audio_path = os.path.join(audio_folder, filename)

                # Extract embedding for the current audio file
                embedding2 = inference(audio_path)

                # Calculate cosine similarity between test embedding and current embedding
                similarity = calculate_similarity(embedding1, embedding2)

                # Update max similarity and speaker if current similarity is higher
                if similarity > max_similarity:
                    max_similarity = similarity
                    most_similar_speaker = filename[:-4]  # Extract speaker name without ".wav"

        # Print the results
        if most_similar_speaker:
            return Response(json.dumps({'username': most_similar_speaker}),status=200)
        else:
            return Response(json.dumps({'message': 'Could not find a valid user'}),status=400)




class Message_ContextAPI(Resource):
    
    
    def post(self):
        for arg in request.form :
            if arg not in message_context_args:
                return "Invalid JSON",400
            
        session_id = int(hashlib.sha1(request.form['username'].encode("utf-8")).hexdigest(), 16) % (2 ** 32) + int(request.form['session_id'])
        mongo_history = MongoDBChatMessageHistory(
        connection_string="", 
        session_id=session_id
    )
        conversational_memory = ConversationBufferMemory(
            chat_memory=mongo_history,
            memory_key='chat_history',
            return_messages=True,
            # output_key="answer"
        ) 
            
    
        
        llm = ChatGoogleGenerativeAI(model="gemini-pro",convert_system_message_to_human=True)


        problem_chain = LLMMathChain.from_llm(llm=llm)
        math_tool = Tool.from_function(name="Calculator",
                        func=problem_chain.run,
                        description="Useful for when you need to answer questions about math. This tool is only for math questions and nothing else. Only input math expressions.")


        tools = [run_terminal_command,search_tool,math_tool , wikipedia_tool, CurrentDateTimeTool(),SaveUserEmailTool(metadata={'username': "Raghav323"}),SendEmailTool(metadata={'mail':'','password':'','username':'Raghav323'}),ReadEmailTool(metadata={'mail':'','password':'','username':'pritK'}), SendEmailTool2(),getCalenderEventsTool(metadata={'username':'pritK'})]


        agent = initialize_agent(
            agent= AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
            tools=tools,
            llm=llm,
            verbose=True,
            max_iterations=3,
            memory= conversational_memory,
        )

        if 'message' not in request.form or request.form['message'].strip() == "":

            audio_file = request.files['audio']
            recognizer = sr.Recognizer()
            r = sr.Recognizer()
            with sr.AudioFile(audio_file) as source:
                audio_data = r.record(source) 
            # audio_data = BytesIO(request.files['audio'].read())

            try:
                message = recognizer.recognize_google(audio_data)
                res =  agent(message)
                message_list = []
                for m in res['chat_history']:
                    message_list.append(m.content)

                
                final_res = {'input':res['input'],'output':res['output'],'chat_history':message_list}
                print(final_res)
                return Response(json.dumps(final_res),status=200)
            except sr.UnknownValueError:
                return Response(json.dumps({"message":"Speech Recognition could not understand audio"}),status=400)
            except sr.RequestError as e:
                return Response(json.dumps({"message": f"Could not request results from Speech Recognition service; {e}"}),status=400)

            
        else:
            res =  agent(request.form['message'])
            message_list = []
            for m in res['chat_history']:
                message_list.append(m.content)
            final_res = {'input':res['input'],'output':res['output'],'chat_history':message_list}
            print(final_res)
            return Response(json.dumps(final_res),status=200)
        # return Response(json.dumps({}),status=200)
        
        
        
        


api.add_resource(RegisterAPI,  '/register')
api.add_resource(LoginAPI,  '/login')
api.add_resource(Voice_Identification_API,'/voiceIdentification')
api.add_resource(Message_ContextAPI,'/chat')

# from flask import request, jsonify, current_app, g
# from flask_restful import Resource
# from werkzeug.local import LocalProxy
# from flask_pymongo import PyMongo
# from werkzeug.security import generate_password_hash, check_password_hash
# from main import api

# # Import the database connection
# from database import db


# class RegisterAPI(Resource):
#     def post(self):
#         data = request.get_json()

#         # Extract required fields from the request data
#         username = data.get('username')
#         password = data.get('password')

#         # Check if username or password is missing
#         if not username or not password:
#             return jsonify({'message': 'Username and password are required'}), 400

#         # Check if the username already exists
#         if db.users.find_one({'username': username}):
#             return jsonify({'message': 'Username already exists'}), 400

#         # Hash the password before storing it
#         hashed_password = generate_password_hash(password)

#         # Create a new user document
#         new_user = {
#             'username': username,
#             'password': hashed_password
#         }

#         # Insert the new user into the database
#         db.users.insert_one(new_user)

#         return jsonify({'message': 'User registered successfully'}), 201


# class LoginAPI(Resource):
#     def post(self):
#         data = request.get_json()

#         # Extract required fields from the request data
#         username = data.get('username')
#         password = data.get('password')

#         # Check if username or password is missing
#         if not username or not password:
#             return jsonify({'message': 'Username and password are required'}), 400

#         # Find the user in the database
#         user = db.users.find_one({'username': username})

#         # Check if user exists and password is correct
#         if user and check_password_hash(user['password'], password):
#             return jsonify({'message': 'Login successful'}), 200
#         else:
#             return jsonify({'message': 'Invalid username or password'}), 401

# api.add_resource(LoginAPI,  '/login')
# api.add_resource(RegisterAPI,  '/register')
