import json
import os
from jinja2 import Template

# Percorsi
TEMPLATE_FILE = 'data/template.html'
DATA_FILE = 'data/sites.json'
OUTPUT_DIR = 'output'

def generate_sites():
    # Carica il template
    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    template = Template(template_content)

    # Carica i dati dei siti
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        sites_data = json.load(f)

    # Crea cartella output se non esiste
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for site in sites_data:
        site_id = site['id']
        site_dir = os.path.join(OUTPUT_DIR, f"site_{site_id}")
        
        if not os.path.exists(site_dir):
            os.makedirs(site_dir)

        # Rendering del template
        rendered_html = template.render(
            title=site['title'],
            description=site['description'],
            color=site['color'],
            products=site['products']
        )

        # Scrittura del file index.html
        output_file = os.path.join(site_dir, 'index.html')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(rendered_html)
        
        print(f"Generato: {output_file}")

if __name__ == "__main__":
    generate_sites()
