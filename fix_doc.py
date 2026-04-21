import re

def fix_doc():
    with open('Next_Hire_Doc.md', 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. Fix the UC-27 table error
    # Find the bad row
    bad_row_pattern = r'(\|\s*\*\*Exceptions\*\*\s*\|\s*1\. Unreadable Data: The system cannot parse the data format and aborts<br>the validation\.)(<br><br>2\.4\.2 Activity Diagram \(Learner\).*?)( \|)'
    
    def repl_bad_row(m):
        # m.group(1) is the actual exception text
        # m.group(2) is the 2.4.2 section text wrapped in <br>
        
        real_exception = m.group(1) + " |"
        content = m.group(2).replace('<br>', '\n')
        
        return real_exception + "\n\n***\n## " + content + "\n\n![Activity Diagram Learner](diagrams/activity_candidate.png)\n"
    
    text = re.sub(bad_row_pattern, repl_bad_row, text, flags=re.DOTALL)
    
    # 2. Place Activity Diagram (Team)
    text = text.replace('2.4.3.3 Outcome-Based Processes\n- System generates final documentation (SRS, reports,\npresentation).\n\n- Team gains achievement badges and KPIs.\n\n- Team becomes visible to employers.\n\n**Figure 2.2 - Activity Diagram**\n![Activity Diagram Candidate](diagrams/activity_candidate.png)\n![Activity Diagram Employer](diagrams/activity_employer.png)',
                        '2.4.3.3 Outcome-Based Processes\n- System generates final documentation (SRS, reports,\npresentation).\n\n- Team gains achievement badges and KPIs.\n\n- Team becomes visible to employers.\n\n![Activity Diagram Team](diagrams/activity_team.png)')

    # 3. Place Sequence Diagram (Learner)
    text = text.replace('2.4.4.3 Outcome-Based Processes\n- Successful progress → congratulatory notifications.\n\n- Low performance → improvement resources and suggestions.',
                        '2.4.4.3 Outcome-Based Processes\n- Successful progress → congratulatory notifications.\n\n- Low performance → improvement resources and suggestions.\n\n![Sequence Diagram Learner](diagrams/sequence.png)')

    # 4. Place Sequence Diagram (Team)
    text = text.replace('2.4.5.3 Outcome-Based Processes\n- AI generates final project documentation.\n\n- Team becomes visible to employers for recruitment.\n\n**Figure 2.3 - Sequence Diagram**\n![Sequence Diagram](diagrams/sequence.png)',
                        '2.4.5.3 Outcome-Based Processes\n- AI generates final project documentation.\n\n- Team becomes visible to employers for recruitment.\n\n![Sequence Diagram Team](diagrams/sequence_team.png)')

    # 5. Place Database Schema
    text = text.replace('#### 2.4.9 Database Schema\n\n***',
                        '#### 2.4.9 Database Schema\n![Database Schema](diagrams/class_diagram.png)\n\n***')

    with open('Next_Hire_Doc.md', 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    fix_doc()
