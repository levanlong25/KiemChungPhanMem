import os
import shutil

for root, dirs, files in os.walk("."):
    for d in dirs:
        if d == "__pycache__" or d == "migrations":
            path = os.path.join(root, d)
            print("Deleting:", path)
            shutil.rmtree(path)