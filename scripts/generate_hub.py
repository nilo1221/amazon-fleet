import json
import os

OUTPUT_DIR = 'output'
SITES_DATA = 'data/sites.json'

def generate_hub():
    with open(SITES_DATA, 'r', encoding='utf-8') as f:
        sites = json.load(f)

    html = """<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Le Nostre Guide all'Acquisto</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-900 font-sans">
    <header class="bg-indigo-600 text-white py-16 text-center shadow-lg">
        <h1 class="text-5xl font-extrabold mb-4">Consigli Tech & Lifestyle</h1>
        <p class="text-xl opacity-90">Scopri le migliori selezioni di prodotti testati per te.</p>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            """
    
    for site in sites:
        html += f"""
            <a href="site_{site['id']}/index.html" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div class="h-4 px-3 py-1 bg-{site['color']}-100 text-{site['color']}-600 text-xs font-bold rounded-full w-fit mb-4 uppercase tracking-widest">
                    Nicchia {site['id']}
                </div>
                <h2 class="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{site['title']}</h2>
                <p class="text-gray-500 text-sm">{site['description']}</p>
                <div class="mt-6 flex items-center text-indigo-600 font-semibold text-sm">
                    Esplora Guida
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </a>"""

    html += """
        </div>
    </main>

    <footer class="bg-white border-t py-12 text-center text-gray-400 text-sm">
        <p>&copy; 2024 Consigli Tech - Tutti i diritti riservati.</p>
    </footer>
</body>
</html>"""

    output_file = os.path.join(OUTPUT_DIR, 'index.html')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Hub generato con successo in {output_file}")

if __name__ == "__main__":
    generate_hub()
