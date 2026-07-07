#!/usr/bin/env python3
import os
import re

# Pattern da trovare e sostituire
old_pattern = r'<div class="social-bar-v4 mb-3">\s*<a href="#" class="text-white-50 me-3" aria-label="Facebook"><i class="fab fa-facebook"></i></a>\s*<a href="#" class="text-white-50 me-3" aria-label="Instagram"><i class="fab fa-instagram"></i></a>\s*<a href="#" class="text-white-50 me-3" aria-label="Twitter"><i class="fab fa-twitter"></i></a>\s*<a href="#" class="text-white-50" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>\s*</div>'

new_content = '''<div class="social-bar-v4 mb-3">
                            <a href="https://t.me/smartchoicesguide" class="text-white-50 me-3" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
                        </div>'''

# Directory delle nicchie
niche_dir = "/home/lollo/amazon/public/niches"

# Trova tutti i file index.html
for root, dirs, files in os.walk(niche_dir):
    for file in files:
        if file == "index.html":
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Sostituisci il pattern
                new_content = re.sub(old_pattern, new_content, content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"✅ Aggiornato: {file_path}")
                else:
                    print(f"⏭️  Nessuna modifica: {file_path}")
            except Exception as e:
                print(f"❌ Errore in {file_path}: {e}")

print("\n📊 Aggiornamento social links completato!")
