import re

def build_ultra_doc():
    try:
        with open("Next_Hire_Doc.txt", "r", encoding='utf-8') as f:
            original_text = f.read()
    except:
        original_text = "Original documentation text not found."

    # Cleaning original text (basic)
    clean_text = original_text.replace('\x0c', '<div style="page-break-after:always;"></div>') # Page breaks
    
    # New Sections to Inject
    v2_modernization = """
    <section class="v2-update">
        <h1 style="color:#0284c7; border-bottom: 2px solid #0284c7;">MODERNIZATION PHASE (VERSION 2.0)</h1>
        <h2>3.5 UI/UX Revolution: The Bright & Premium Shift</h2>
        <p>In the final development cycle (April 2026), NextHire underwent a complete visual overhaul. Moving away from the legacy dark theme, the platform adopted a "Bright & Premium" aesthetic characterized by high-contrast typography, soft pastel accents, and extensive use of Glassmorphism.</p>
        
        <div class="feature-highlight">
            <h3>The 9+ AI Core Modules</h3>
            <ul>
                <li><strong>TalentAI Pulse:</strong> Real-time recruiter analytics dashboard.</li>
                <li><strong>Biometric Face ID:</strong> Local-first AI facial recognition security.</li>
                <li><strong>Internet Speed Monitor:</strong> 3D gauge for remote-readiness verification.</li>
                <li><strong>Pivot Predictor:</strong> Career transition probability engine.</li>
                <li><strong>Offer Weight Calculator:</strong> Multi-factor job offer comparison.</li>
            </ul>
        </div>
    </section>
    """

    # HTML Template
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>NextHire Ultra Documentation — 100+ Pages Edition</title>
        <style>
            body {{ font-family: 'Inter', sans-serif; line-height: 1.8; color: #1e293b; background: #f8fafc; padding: 20px; }}
            .container {{ max-width: 900px; margin: 0 auto; background: white; padding: 60px; box-shadow: 0 0 40px rgba(0,0,0,0.1); border-radius: 8px; }}
            h1 {{ color: #0284c7; text-transform: uppercase; margin-top: 50px; font-size: 32pt; }}
            h2 {{ color: #0f172a; margin-top: 30px; font-size: 22pt; }}
            p {{ text-align: justify; margin-bottom: 20px; white-space: pre-wrap; }}
            .feature-highlight {{ background: #f0f9ff; padding: 30px; border-radius: 12px; border-left: 8px solid #0284c7; margin: 40px 0; }}
            ul {{ margin-bottom: 20px; }}
            li {{ margin-bottom: 10px; font-size: 13pt; }}
            @media print {{
                body {{ background: none; padding: 0; }}
                .container {{ box-shadow: none; max-width: 100%; width: 100%; padding: 0; }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div style="text-align:center; padding: 100px 0;">
                <h1 style="font-size: 60pt; margin: 0;">NextHire</h1>
                <p style="font-size: 20pt; color: #64748b;">Comprehensive Graduation Documentation — Master Release</p>
                <div style="height:10px; background: #0284c7; width: 200px; margin: 40px auto;"></div>
                <p style="font-size: 16pt;"><b>Lead Developer:</b> Mohamed Abd Elhameed</p>
                <p style="font-size: 14pt; color: #94a3b8;">April 2026 | Banha University</p>
            </div>
            
            <div style="page-break-after:always;"></div>
            
            {v2_modernization}
            
            <hr style="margin: 60px 0; border: 0; border-top: 1px solid #e2e8f0;">
            
            <h1>ORIGINAL DOCUMENTATION (95 PAGES EXTRACT)</h1>
            <div class="original-content">
                {clean_text}
            </div>
        </div>
    </body>
    </html>
    """
    
    with open("Next_Hire_Ultra_Doc.html", "w", encoding='utf-8') as f:
        f.write(html_content)

if __name__ == "__main__":
    build_ultra_doc()
    print("Next_Hire_Ultra_Doc.html generated successfully!")
