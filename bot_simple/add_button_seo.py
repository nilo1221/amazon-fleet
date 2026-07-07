#!/usr/bin/env python3
import os
import re

base_dir = "/home/lollo/amazon/public"

# Trova tutti i file HTML con btn-amazon
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Pattern per trovare link Amazon senza aria-label
                # Cerca: <a href="...amazon..." class="btn-amazon ...">
                pattern = r'(<a[^>]*href="[^"]*amazon[^"]*"[^>]*class="[^"]*btn-amazon[^"]*"[^>]*)(>)'
                
                def add_seo_attrs(match):
                    opening_tag = match.group(1)
                    closing = match.group(2)
                    
                    # Se ha già aria-label, non modificare
                    if 'aria-label=' in opening_tag:
                        return match.group(0)
                    
                    # Aggiungi attributi SEO
                    # Estrai il testo del link se possibile
                    text_match = re.search(r'>([^<]+)</a>', content[content.find(match.group(0)):content.find(match.group(0)) + 200])
                    link_text = text_match.group(1).strip() if text_match else "Acquista su Amazon"
                    
                    # Aggiungi attributi
                    new_tag = opening_tag
                    if 'title=' not in new_tag:
                        new_tag += f' title="{link_text}"'
                    new_tag += f' aria-label="{link_text}"'
                    if 'rel=' not in new_tag:
                        new_tag += ' rel="nofollow sponsored"'
                    
                    return new_tag + closing
                
                content = re.sub(pattern, add_seo_attrs, content)
                
                # Cerca anche altri link Amazon
                pattern2 = r'(<a[^>]*href="[^"]*amazon[^"]*"[^>]*)(>)'
                
                def add_seo_to_all_amazon(match):
                    opening_tag = match.group(1)
                    closing = match.group(2)
                    
                    # Se ha già aria-label o è btn-amazon, skip
                    if 'aria-label=' in opening_tag or 'btn-amazon' in opening_tag:
                        return match.group(0)
                    
                    # Aggiungi attributi base
                    new_tag = opening_tag
                    if 'title=' not in new_tag:
                        new_tag += ' title="Vedi su Amazon"'
                    new_tag += ' aria-label="Vedi su Amazon"'
                    if 'rel=' not in new_tag:
                        new_tag += ' rel="nofollow sponsored"'
                    
                    return new_tag + closing
                
                content = re.sub(pattern2, add_seo_to_all_amazon, content)
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ {file_path}")
                    
            except Exception as e:
                print(f"❌ Errore in {file_path}: {e}")

print("\n🎉 SEO attributi aggiunti ai bottoni!")
