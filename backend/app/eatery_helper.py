import io
from PIL import Image
from datetime import datetime
import random

# current time + random int, collision unlikely
def generate_image_filename():
    now = int(datetime.now().timestamp())
    new_str = f"{now}_{random.randint(0,100)}.jpg"
    return new_str
