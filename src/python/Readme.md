# Python Backend Setupp:

# 1. Creating/Activating the Virtual Environment 

- Open a terminal in the `src/python` directory and run:

# Creating virtual environment named venv

python -m venv venv

# Activating the virtual environment (Windows)

venv\Scripts\activate

# Activating the virtual environment (macOS/Linux)
source venv/bin/activate

# 2. Install Python Dependencies

- With the venv activated, install:

pip install spacy torch transformers

python -m spacy download en_core_web_sm

## 3. Notice:

- Make sure the virtual environment venv is **activated** to test backend Python scripts individually.
- The backend expects to be called from the Node.js server (see `mindmapProcess.js`). Running mindmapProcess.js runs a default context.
- If python is not working, install the version of python from the microsoft store (windows)