import re

def clean_pdf_text(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    cleaned = []
    skip = False
    for line in lines:
        line = line.replace('\x0c', '') # remove form feed
        stripped = line.strip()
        
        # Skip isolated numbers (page numbers)
        if stripped.isdigit():
            continue
            
        # Skip headers like "Chapter Two: System Analysis" which repeat
        if stripped.startswith("Chapter ") and ":" in stripped:
            continue
            
        # Skip Table of Contents and List of Figures lists (they get messed up anyway)
        if stripped.startswith("TABLE OF CONTENTS") or stripped.startswith("LIST OF FIGURES") or stripped.startswith("LIST OF TABLES"):
            skip = True
        
        if skip:
            if stripped == "1 INTRODUCTION" or stripped.startswith("Chapter One"):
                skip = False
            else:
                continue
                
        cleaned.append(line)
        
    text = "".join(cleaned)
    return text

def format_markdown(text):
    # Headings
    text = re.sub(r'^(Chapter [A-Za-z]+)\s*$', r'# \1', text, flags=re.MULTILINE)
    text = re.sub(r'^([1-9]\s+[A-Z\s]+)$', r'## \1', text, flags=re.MULTILINE)
    text = re.sub(r'^([1-9]\.[1-9]\s+[A-Z\s]+)$', r'### \1', text, flags=re.MULTILINE)
    text = re.sub(r'^([1-9]\.[1-9]\.[1-9]\s+[A-Za-z\s]+)$', r'#### \1', text, flags=re.MULTILINE)
    text = re.sub(r'^([1-9]\.[1-9]\.[1-9]\.[1-9]\s+[A-Za-z\s&]+:?)$', r'##### \1', text, flags=re.MULTILINE)
    
    # Diagrams mapping
    diagrams = {
        "Figure 2.1 - Use Case": "![Use Case](file:///home/fs/Music/project%20next%20/diagrams/use_case.png)",
        "Figure 2.2 - Activity Diagram": "![Activity Diagram Candidate](file:///home/fs/Music/project%20next%20/diagrams/activity_candidate.png)\n![Activity Diagram Employer](file:///home/fs/Music/project%20next%20/diagrams/activity_employer.png)",
        "Figure 2.3 - Sequence Diagram": "![Sequence Diagram](file:///home/fs/Music/project%20next%20/diagrams/sequence.png)",
        "Figure 2.4 - Context Diagram": "![Context Diagram](file:///home/fs/Music/project%20next%20/diagrams/context.png)",
        "Figure 2.5 - Data Flow Diagram": "![Data Flow Diagram Level 1](file:///home/fs/Music/project%20next%20/diagrams/dfd_level_1.png)\n![Data Flow Diagram Level 2 AI](file:///home/fs/Music/project%20next%20/diagrams/dfd_level_2_ai.png)\n![Data Flow Diagram Level 2 Job](file:///home/fs/Music/project%20next%20/diagrams/dfd_level_2_job.png)",
        "Figure 2.6 - ERD": "![ERD](file:///home/fs/Music/project%20next%20/diagrams/erd.png)",
        "Figure 2.7 - Database Schema": "![Database Schema](file:///home/fs/Music/project%20next%20/diagrams/class_diagram.png)", # using class for schema
    }
    
    for key, val in diagrams.items():
        # insert val after the key
        text = text.replace(key, f"**{key}**\n{val}\n")
        
    return text

def add_new_features(text):
    new_features_text = """
##### 2.2.1.15 Cover Letter Architect:
The system shall automatically generate a fully personalized professional cover letter by combining the candidate's profile data with the target job description.

##### 2.2.1.16 Pivot Predictor & Career Roadmap:
The system shall analyze the candidate's current skill set against a target career path and return a statistical probability of successful transition, an estimated timeline, and a step-by-step action plan.

##### 2.2.1.17 Offer Weight Calculator:
The system shall allow candidates to input data from multiple job offers (salary, equity, benefits, location) and output a weighted comparative score for each.

##### 2.2.1.18 Personal Branding Assistant & Trendings:
The system shall provide personalized branding suggestions and real-time tech trend updates to keep users aligned with industry standards.

##### 2.2.1.19 Saved Jobs & Application Tracker:
Users shall be able to save jobs, track their application statuses through a Kanban-style board, and receive notifications via a notification bell system.
"""
    # Insert new features at the end of Functional Requirements (before Non-Functional Requirements)
    parts = text.split("2.2.2 Non-Functional requirements:")
    if len(parts) > 1:
        text = parts[0] + new_features_text + "\n### 2.2.2 Non-Functional requirements:\n" + parts[1]
        
    # Append remaining diagrams at the end of Chapter 2
    extra_diagrams = """
#### 2.4.10 Additional System Models
**Block Diagram**
![Block Diagram](file:///home/fs/Music/project%20next%20/diagrams/block_diagram.png)

**State Machine Diagrams**
![State App](file:///home/fs/Music/project%20next%20/diagrams/state_app.png)
![State Auth](file:///home/fs/Music/project%20next%20/diagrams/state_auth.png)
![State CV](file:///home/fs/Music/project%20next%20/diagrams/state_cv.png)

**Project Management Models**
![Gantt Chart](file:///home/fs/Music/project%20next%20/diagrams/gantt.png)
![PERT Chart](file:///home/fs/Music/project%20next%20/diagrams/pert.png)
![Network Diagram](file:///home/fs/Music/project%20next%20/diagrams/network.png)
"""
    parts = re.split(r'#+\s*3\s+SYSTEM DESIGN', text, flags=re.IGNORECASE)
    if len(parts) > 1:
        text = parts[0] + extra_diagrams + "\n## 3 SYSTEM DESIGN\n" + parts[1]
    
    # Remove UI figure references in Chapter 3 as we don't have assets folder
    text = re.sub(r'Figure 3\.\d+\s*[-–].*?\n', '', text)
    
    return text

text = clean_pdf_text("Next_Hire_Project_2.txt")
text = format_markdown(text)
text = add_new_features(text)

with open("Next_Hire_Doc.md", "w", encoding='utf-8') as f:
    f.write(text)

print("Generated Next_Hire_Doc.md successfully!")
