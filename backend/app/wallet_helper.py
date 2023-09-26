import time
import random

class TimedDictionary:
    def __init__(self, timeout_seconds=60):
        self.timeout = timeout_seconds
        self.data = {}

    def __getitem__(self, key):
        if self._is_expired(key):
            del self.data[key]
            raise KeyError(f"Key '{key}' has expired")

        return self.data[key]['value']

    def __setitem__(self, key, value):
        self.data[key] = {
            'value': value,
            'expires_at': time.time() + self.timeout
        }

    def __delitem__(self, key):
        del self.data[key]

    def __contains__(self, key):
        if key in self.data:
            if self._is_expired(key):
                del self.data[key]
                return False
            else:
                return True
        return False
    
    def get(self, key):
        if not self.__contains__(key):
            return None
        return self.data[key]['value']

    def _is_expired(self, key):
        if key in self.data:
            return self.data[key]['expires_at'] < time.time()
        return False

code_dict = TimedDictionary(30)

def generate_short_code():
    charset="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    
    code=""    
    for _ in range(4):
        code += charset[random.randint(0,35)]
    
    return code
