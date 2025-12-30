How to Set Up and Run Project huskey Locally

Follow these steps to set up and run the project with the Ollama platform, Mistral Basic LM, and Google API tools.

Step 1: Install Ollama Platform

Visit the Ollama Website or GitHub:
Go to the official Ollama platform page to get the most up-to-date installation instructions.

Install the Platform:
Depending on the installation method, use the following command:

For Python (if Ollama is a Python library):

pip install ollama


For Node.js (if Ollama uses npm):

npm install ollama


Make sure to check Ollama’s documentation for specific installation instructions.

Step 2: Install Mistral Basic LM

Find the Mistral Basic LM Documentation:
The model is likely downloadable from a platform like Hugging Face.

Install the Model:

First, install the transformers library:

pip install transformers


Load the Mistral LM model in Python:

from transformers import MistralTokenizer, MistralForCausalLM

model = MistralForCausalLM.from_pretrained("mistral-7B")  # Replace with the model version
tokenizer = MistralTokenizer.from_pretrained("mistral-7B")


Test Installation:
To check if the model loads correctly, use the following Python script:

inputs = tokenizer("Hello, world!", return_tensors="pt")
outputs = model.generate(inputs['input_ids'])
print(tokenizer.decode(outputs[0], skip_special_tokens=True))


Step 3: Install Google API Tools (If Needed)

If you need Google APIs (for cloud services, AI tools, etc.), follow these steps:

Create a Google Cloud Account:
Sign up or log in to Google Cloud Platform.

Enable Google API:
In the Google Cloud Console, enable the specific API (e.g., Google Sheets, Google Cloud Storage).

Install the Google API Client Library:

pip install --upgrade google-api-python-client


Authenticate with Google Cloud:
Set up a service account and download the credentials JSON file.

Then, set the environment variable with the path to your credentials file:

export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-credentials-file.json"


Test Google API Connection:
Use the following script to check the connection (e.g., to Google Sheets):

from googleapiclient.discovery import build
from google.oauth2 import service_account

creds = service_account.Credentials.from_service_account_file("path/to/your-credentials-file.json")
service = build('sheets', 'v4', credentials=creds)

spreadsheet_id = 'your-spreadsheet-id'
range_name = 'Sheet1!A1:C10'
result = service.spreadsheets().values().get(
    spreadsheetId=spreadsheet_id,
    range=range_name
).execute()
print(result)


Step 4: Clone the Repository and Run Locally

Clone the Repository:
Clone the project repository from GitHub:

git clone https://github.com/imonish/project-mark-1.git


Navigate to the Public Folder:
Change into the public directory:

cd project-mark-1/public


Open index.html:
You can open index.html directly in your browser, or use a local server to run it.

To start a Python-based server:

python -m http.server


Test the Project:
Visit http://localhost:8000
 (or the port shown in the terminal) to view the project running in your browser.

Final Version Example for README

Here's a quick summary that you can add to your README file or Project Description:

How to Run Mark-1 with Ollama, Mistral LM, and Google API

Step 1: Install Ollama Platform
Visit the Ollama website and install the platform:

pip install ollama


Step 2: Install Mistral Basic LM
Install the Mistral model (e.g., from Hugging Face):

pip install transformers


Load the model in Python:

from transformers import MistralTokenizer, MistralForCausalLM
model = MistralForCausalLM.from_pretrained("mistral-7B")
tokenizer = MistralTokenizer.from_pretrained("mistral-7B")


Step 3: Install Google API Tools
Install the Google API client:

pip install --upgrade google-api-python-client


Authenticate using your Google Cloud credentials:

export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-credentials-file.json"


Step 4: Clone the Repo and Run

Clone the repository:

git clone https://github.com/Forge-Mind07/huskey-project


Navigate to the public folder:

cd huskey-project


Open index.html or use a local server to view the project:

python -m http.server
