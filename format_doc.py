import re

def format_doc(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. Add horizontal rules before # and ## (except the very first ones)
    # text = re.sub(r'\n(#+ .*)', r'\n\n---\n\1', text)
    # A better way to add HRs:
    text = re.sub(r'\n(##? [A-Z])', r'\n---\n\1', text)
    
    # 2. Fix bullet points
    # Currently they look like:
    # •
    #
    # Text
    text = re.sub(r'•\n+\s*(.*?)(?=\n\n|\n•|\Z)', r'- \1', text, flags=re.DOTALL)
    
    # Clean up multiple newlines
    text = re.sub(r'\n{3,}', r'\n\n', text)
    
    # 3. Format Use Cases as Tables
    # We can look for blocks starting with `\d+\. Use Case ".*?"`
    
    def replace_use_case(match):
        block = match.group(0)
        # Parse fields
        id_match = re.search(r'ID\n+(UC-\d+)', block)
        name_match = re.search(r'Use Case Name\n+(.*?)\n+Actors', block, re.DOTALL)
        actors_match = re.search(r'Actors\n+(.*?)\n+Preconditions', block, re.DOTALL)
        pre_match = re.search(r'Preconditions\n+(.*?)\n+Postconditions', block, re.DOTALL)
        post_match = re.search(r'Postconditions\n+(.*?)\n+Normal Flow', block, re.DOTALL)
        normal_match = re.search(r'Normal Flow\n+(.*?)\n+(?:Alternative|Alternative\n+Flow)', block, re.DOTALL)
        alt_match = re.search(r'(?:Alternative|Alternative\n+Flow)\n+(.*?)\n+Exceptions', block, re.DOTALL)
        exc_match = re.search(r'Exceptions\n+(.*?)$', block, re.DOTALL)
        
        if not (id_match and name_match and actors_match and pre_match and post_match and normal_match):
            return block # fallback if parsing fails
            
        uc_id = id_match.group(1).strip()
        uc_name = name_match.group(1).strip().replace('\n', ' ')
        actors = actors_match.group(1).strip().replace('\n', ' ')
        pre = pre_match.group(1).strip().replace('\n', '<br>')
        post = post_match.group(1).strip().replace('\n', '<br>')
        normal = normal_match.group(1).strip().replace('\n', '<br>')
        alt = alt_match.group(1).strip().replace('\n', '<br>') if alt_match else "-"
        exc = exc_match.group(1).strip().replace('\n', '<br>') if exc_match else "-"
        
        table = f"""
### Use Case: {uc_name} ({uc_id})

| Attribute | Description |
|---|---|
| **ID** | {uc_id} |
| **Name** | {uc_name} |
| **Actors** | {actors} |
| **Preconditions** | {pre} |
| **Postconditions** | {post} |
| **Normal Flow** | {normal} |
| **Alternative Flow** | {alt} |
| **Exceptions** | {exc} |
"""
        return table
        
    text = re.sub(r'\d+\.\s*Use Case\s*".*?".*?(?=\n\n\d+\.\s*Use Case|\n\n#|\Z)', replace_use_case, text, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    format_doc('Next_Hire_Doc.md')
