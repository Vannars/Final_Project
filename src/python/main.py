# Importing a bunch - remember to activate .venv otherwise none of this works 
import sys
import json
import uuid
import spacy
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from collections import defaultdict

# Import local module - context_conditions.py - splitting text and boundaries etc
from context_conditions import format_context

# Loading spaCy and transformer model (Cited - didnt train myself just adopting it)
nlp = spacy.load("en_core_web_sm")
tokenizer = AutoTokenizer.from_pretrained("mrm8488/t5-base-finetuned-question-generation-ap", legacy=False)
model = AutoModelForSeq2SeqLM.from_pretrained("mrm8488/t5-base-finetuned-question-generation-ap")

# Unused function: 
# I dont use this one - but made it because the model sometimes generates an answer that starts with "and" - this removes it but the results are iffy
def regenerate_question_from_answer_only(answer, max_length=64): # keeping for implementation doc 
    input_text = f"Turn this answer into a question: {answer}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt")
    output = model.generate(input_ids=input_ids, max_length=max_length)
    return tokenizer.decode(output[0], skip_special_tokens=True)
# In use functions:
def get_question(answer, context, max_length=250): # I mean if sentence is longer than 250 it should probably be spliced up regardlesss
    input_text = f"answer: {answer}  context: {context}"
    features = tokenizer([input_text], return_tensors='pt')
    output = model.generate(input_ids=features['input_ids'], attention_mask=features['attention_mask'], max_length=max_length)
    return tokenizer.decode(output[0])

def get_sentences(text):
    if "custom_boundaries" not in nlp.pipe_names:
        nlp.add_pipe("custom_boundaries", before="parser")
    doc = nlp(text)
    sentences = [s.text.strip() for s in doc.sents]
    return sentences

def gen_questions_hierarchial(text): # also a bit text hungry
    sentences = get_sentences(text) # uses get_sentences
    analysed_s = set() #looked at sentencews go here
    children = [] #for children
    seen_questions = defaultdict(int) # default dict for counting occurances

    for s in sentences: # loop through sentences
        cleaned_s = s.strip() # technically three times im getting rid of whitespace but this tripples down on that check
        if len(cleaned_s) < 1 or cleaned_s in analysed_s: # if it makes no sense or is only like one character ill skip it 
            continue
        analysed_s.add(cleaned_s) # analysed becomes cleansed
        
        # Because notation is ugh - get_sentence returns array of sentence - s in sentences loops that array
        # q_cleaned - cleans the questions (go figure) 
        # answer - formats the thing (see context_conditions.py)
        q_cleaned = get_question(cleaned_s, text).replace("<pad> question: ", "").replace("</s>", "").strip() # weird ugly padding? - had to remove it 
        answer = format_context(cleaned_s)
        
        seen_questions[q_cleaned] += 1 # is this magic? no but dict counts in integers - so this value - this question - has an int value in the dict that gets incremeted . groovy
        if seen_questions[q_cleaned] > 1 and q_cleaned.startswith("What"):
            q_cleaned = f"{seen_questions[q_cleaned]}) {q_cleaned[0].lower() + q_cleaned[1:]}" # im not really happy with what else clauses - so i numbered them for repeated questions 

        children.append({
            "Question": q_cleaned,
            "Answer": answer,
            "QAID": str(uuid.uuid4()),
            "children": []
        })

    return children

def output_main(context_arg=None): #check input text in main for the sister condition 
    default_context = (
        "The answer to life the universe and everything is 42. This quote comes from the Hitchhikers guide to the galaxy by Douglas Adams."
    )
    context_to_use = context_arg if context_arg else default_context
    children = gen_questions_hierarchial(context_to_use)

    result = {
        "Question": "Root",
        "QAID": "Root",
        "children": children
    }

    mindmap_data = {
        "Question": result["Question"],
        "QAID": result["QAID"],
        "children": [{
            "Question": item["Question"],
            "Answer": item["Answer"],
            "QAID": item["QAID"],
            "children": item["children"]
        } for item in result["children"]]
    }

    return json.dumps(mindmap_data, indent=2)

if __name__ == "__main__":
    input_text = sys.argv[1] if len(sys.argv) > 1 else "" # in the first argument - if it is less than 1 (default context) and imput is emptys
    output = output_main(input_text)
    print(output)



# CITATION

# THIS IS THE CITATION FOR THE T5 MODEL USED IN THE QUESTION GENERATION COMPONENT
# THIS CODE HAS BEEN HEAVILY MODIFIED IN ORDER TO FIT THE NEEDS OF THE PROJECT
# THE ORIGINAL CODE CAN BE FOUND AT: https://huggingface.co/mrm8488/t5-base-finetuned-question-generation-ap
# THE ORIGINAL CODE WAS WRITTEN BY MANUEL ROMERO
# THE ORIGINAL CODE IS LICENSED UNDER THE APACHE 2.0 LICENSE
# THE ORIGINAL CODE WAS PUBLISHED ON THE HUGGING FACE HUB
# THE ORIGINAL CODE WAS PUBLISHED IN 2021

# @misc{mromero2021t5-base-finetuned-question-generation-ap,
#   title={T5 (base) fine-tuned on SQUAD for QG via AP},
#   author={Romero, Manuel},
#   publisher={Hugging Face},
#   journal={Hugging Face Hub},
#   howpublished={\url{https://huggingface.co/mrm8488/t5-base-finetuned-question-generation-ap}},
#   year={2021}
# }
