import spacy
from spacy.language import Language
nlp = spacy.load("en_core_web_sm")

# Because my model's capability for semantic processing is limitied I have to define sentence boundaries myself. 
# This file contains functions of the contextual conditions for the model to use for question generation.
# These function are intened to be used prior to passing individual strings to the model.     

# 1) Custom_boundaries takes a document and sets boundaries for the model to use for segmentation of the text.
#    the bounaries I have defined are the period "." and the oxford comma ", and". In practice this means that 
#    the a model can use this function to treat periods and oxford commas as sentence boundaries, a.k.a seperate sentences.

# 2) format_context takes an answer - a segmented string of the original source text - formats it by removing whitespace,
#    removing the word "and" if the segemented string begins with it, and captialises the first letter of te string for readability.

@Language.component("custom_boundaries")

def custom_boundaries(doc):
    for token in doc[:-1]:
         # These two conditionals ensure sentence boundaries occur at periods (default) and oxford commas (", and").
         if token.text == "," and token.nbor(1).text == "and":  # oxford comma boundary (apprently we do we give a flip about an oxford comma)
            doc[token.i + 1].is_sent_start = True
         if token.text == ".":  
            doc[token.i + 1].is_sent_start = True
    return doc

# adding to the pipeline is necessary - otherwise no custom bonundaries :(
if "custom_boundaries" not in nlp.pipe_names:
    nlp.add_pipe("custom_boundaries", before="parser")

# Sometimes the model generates an answer that starts with the conjunction "and" from the boundary - format_context removes it.
def format_context(answer):
    answer = answer.strip()
    if answer.lower().startswith("and"):
        answer = answer[4:]
    if len(answer) > 0 and not answer[0].isupper():
        answer = answer[0].upper() + answer[1:]
    return answer

def extract_fact(block): # made thise - havent used  it - its intended to extract nounds and numbers from text blocks - not really a fact - probably rename it
    doc = nlp(block)
    nouns = [token.text for token in doc if token.pos_ in ("NOUN", "PROPN") and token.dep_ != "det"]
    numbers = [token.text for token in doc if token.pos_ == "NUM"]
    if numbers:
        return block
    if nouns:
        return block
    return block