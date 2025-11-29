# This is a sample Python script.
import uvicorn
from app import app


# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


# Press the green button in the gutter to run the script.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
