def is_english(word):
    for c in word.lower():
        if ord(c) > ord('z') or ord(c) < ord('a'):
            return False
    return True


with open('english.txt','r',encoding='utf-8') as f:
    lines = [line.strip() for line in f.read().strip().split('\n') if not line.startswith('#') and len(line) == 5]
words = [word.lower() for word in lines if is_english(word)]
with open('english-words.txt', 'w') as f:
    f.write('\n'.join(words))