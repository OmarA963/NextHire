import re
import os

def assemble_master():
    try:
        with open("Next_Hire_Doc.txt", "r", encoding='utf-8') as f:
            text = f.read()
    except:
        return "Source text not found."

    # Mapping figures to images in the diagrams folder
    diagrams_path = "file:///home/fs/Pictures/front next/diagrams/"
    fig_map = {
        r"Figure 2\.1": "use_case.png",
        r"Figure 2\.2": "activity_candidate.png",
        r"Figure 2\.3": "sequence.png",
        r"Figure 2\.4": "context.png",
        r"Figure 2\.5": "dfd_level_1.png",
        r"Figure 2\.6": "erd.png",
        r"Figure 2\.7": "class_diagram.png",
        r"Gantt Chart": "gantt.png",
        r"PERT Chart": "pert.png",
        r"Network Diagram": "network.png",
        r"Block Diagram": "block_diagram.png",
        r"State App": "state_app.png",
        r"State Auth": "state_auth.png",
        r"State CV": "state_cv.png",
    }

    for pattern, img in fig_map.items():
        text = re.sub(pattern, f"\n**{pattern}**\n![{img}]({diagrams_path}{img})\n", text)

    # Adding the Modernization and New Work at the end of Chapter 3
    new_work = """
## CHAPTER 3.5: MODERNIZATION & AI ECOSYSTEM (VERSION 2.0)

### 3.5.1 UI/UX Evolution
The platform underwent a full aesthetic modernization, transitioning to a 'Bright & Premium' theme. This included:
- **Glassmorphism:** Implementing translucent UI layers for depth.
- **3D Asset Integration:** Deploying custom 3D renders for service visualization.

### 3.5.2 Advanced AI Features
- **Biometric Face ID:** Secure localized authentication.
- **TalentAI Pulse:** Real-time recruiter analytics.
- **Internet Speed Test:** Built-in 3D gauge for remote work readiness.
- **Offer Weight Calculator:** Multi-factor comparative analysis.
- **Pivot Predictor:** Career transition probability engine.
"""
    
    # Simple injection after Chapter Three heading
    text = text.replace("Chapter Three", "Chapter Three\n" + new_work)

    # Master Markdown Template
    master_md = f"""# NEXTHIRE: COMPREHENSIVE PROJECT DOCUMENTATION
## Graduation Project — Final Master Version

**Developer:** Mohamed Abd Elhameed
**Version:** 2.0 (Complete Edition)

---

{text}
"""

    with open("Next_Hire_Doc_Complete.md", "w", encoding='utf-8') as f:
        f.write(master_md)

if __name__ == "__main__":
    assemble_master()
    print("Next_Hire_Doc_Complete.md assembled with images and text!")
