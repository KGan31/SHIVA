
from langchain.tools import BaseTool,StructuredTool,tool,Tool
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain_community.utilities import WikipediaAPIWrapper
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os.path
import pickle
import datetime
from database import db 
import smtplib
import imaplib
import email
import subprocess

class SendEmailTool(BaseTool):
    name = "send_email_name"
    description = "Sends email to given name by directly extracting subject and body"
    def _run(self,name:str,subject:str,body:str):
        from_mail = self.metadata['mail']
        sender_app_pass = self.metadata['password']
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587
        
        res = db.user_emails.find_one({'username':self.metadata['username'],
                                 'name':name})
        if not res :
            return f"I do not know the mail-id of {name}. Ask the user to give email . Dont use any action"

        to_mail = res['email']
        # print(res)
        message = f'Subject: {subject}\n\n{body}'

        try:
            with smtplib.SMTP(smtp_server, smtp_port) as smtp:
                smtp.starttls()
                smtp.login(from_mail, sender_app_pass)
                smtp.sendmail(from_mail, to_mail, message)
            return "Email sent successfully."
        except Exception as e:
            return "An error occurred while sending the email"

class SendEmailTool2(BaseTool):
    name = "send_email_by_email_addr"
    description = "Sends email to given email address by directly extracting subject and body"
    def _run(self,to_email:str,subject:str,body:str):
        from_mail = self.metadata['mail']
        sender_app_pass = self.metadata['password']
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587
        
       
        
        # print(res)
        message = f'Subject: {subject}\n\n{body}'

        try:
            with smtplib.SMTP(smtp_server, smtp_port) as smtp:
                smtp.starttls()
                smtp.login(from_mail, sender_app_pass)
                smtp.sendmail(from_mail, to_email, message)
            return "Email sent successfully."
        except Exception as e:
            return "An error occurred while sending the email"
        
class ReadEmailTool(BaseTool):
    name = "read_latest_email"
    description = "Returns the subject and sender of the latest 3 mails received by current user"

    
    def _run(self):
        imap_server = 'imap.gmail.com'
        username = self.metadata['username']
        from_mail = self.metadata['mail']
        sender_app_pass = self.metadata['password']
        with imaplib.IMAP4_SSL(imap_server) as imap:
            imap.login(from_mail,sender_app_pass)
            imap.select('inbox')
            _, data = imap.search(None, 'ALL')
            latest_email_id = data[0].split()[-1]
            _, message_data = imap.fetch(latest_email_id, '(BODY.PEEK[HEADER])')
            message = email.message_from_bytes(message_data[0][1])
            subject = message['Subject']
            sender = message['From']
            latest_email_id = data[0].split()[-2]
            _, message_data = imap.fetch(latest_email_id, '(BODY.PEEK[HEADER])')
            message = email.message_from_bytes(message_data[0][1])
            subject2 = message['Subject']
            sender2 = message['From']
            latest_email_id = data[0].split()[-3]
            _, message_data = imap.fetch(latest_email_id, '(BODY.PEEK[HEADER])')
            message = email.message_from_bytes(message_data[0][1])
            subject3 = message['Subject']
            sender3 = message['From']


        return f"For latest mail the Subject is {subject} and Sender is {sender} For second latest mail the Subject is {subject2} and Sender is {sender2}, and for the third latest mail the Subject is {subject3} and Sender is {sender3}"


class SaveUserEmailTool(BaseTool):
    name = "save_user_email_db"
    description = "It saves the email and name of the person in database"

    
        

    def _run(self,email:str,name:str):
        
        """Saves the email of a user in database"""
        new_user_emails = {
            'username': self.metadata['username'],
            'name':name,
            'email':email
           
        }

        db.user_emails.insert_one(new_user_emails)

        return "Saved email and name successfully in database ."


    def _arun(self):
        raise NotImplementedError("get_current_date_time does not support async")
    

def get_current_date_time():
    now = datetime.datetime.now()
    return now.strftime("%d/%m/%Y %H:%M:%S")

class CurrentDateTimeTool(BaseTool):
    name = "get_date_time_price"
    description = "It gives you the date and time on when this query was asked "

    def _to_args_and_kwargs(self, tool_input):
        return (), {}
    
    def _run(self):
        response = get_current_date_time()
        return response


    def _arun(self):
        raise NotImplementedError("get_current_date_time does not support async")

@tool
def run_terminal_command(command:str):
    """ This function runs the terminal command and returns the output of the command"""
    commands = command.split()
    if commands[0]=='rm':
        return "Cannot execute rm command. It is disabled for security reasons."
    process = subprocess.Popen(commands , stdout=subprocess.PIPE)
    output, error = process.communicate()
    return output.decode('utf-8') 

class getCalenderEventsTool(BaseTool):
    name = "get_calender_events"
    description = "It gives you the upcoming events in your calender"

    def _run(self):
        SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
        creds = None
        # The file token.pickle stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                creds = flow.run_local_server(port=0)
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        service = build('calendar', 'v3', credentials=creds)

        # Call the Calendar API
        now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
        print('Getting the upcoming 10 events')
        events_result = service.events().list(calendarId='primary', timeMin=now,
                                            maxResults=10, singleEvents=True,
                                            orderBy='startTime').execute()
        events = events_result.get('items', [])

        if not events:
            return 'No upcoming events found.'
        all_events = "Upcoming events are : \n "
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            all_events+= f"{start} , {event['summary']} \n"
    
        return all_events

search = GoogleSearchAPIWrapper()

search_tool = StructuredTool.from_function(
    name="google_search",
    description="Search Google for knowledge.",
    func=search.run,
)


wikipedia = WikipediaAPIWrapper()

wikipedia_tool = StructuredTool.from_function(name="Wikipedia",
                      func=wikipedia.run,
	              description="A useful tool for searching the wikipedia to find information on world events, issues, dates, years, etc. Worth using for general topics. Use precise questions.")
