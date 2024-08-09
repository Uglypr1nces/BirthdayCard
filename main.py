import pandas as pd
import webbrowser
import os

def conversion(text):
    return text.lower()

df = pd.read_csv("birthdaycard/content/letter.csv")
current_location = os.path.dirname(os.path.realpath(__file__))

sender = input("Enter your name: ")
receiver = input("Enter the receiver's name: ")
message = input("Enter the message: ")
df = pd.concat([df, pd.DataFrame({"from": [sender], "to": [receiver], "message": [message]})], ignore_index=True)
df["from"] = df["from"].apply(conversion)
df["to"] = df["to"].apply(conversion)
df["message"] = df["message"].apply(conversion)
df.to_csv("birthdaycard/content/letter.csv", index=False)

webbrowser.open(current_location+"/birthdaycard/index.html")