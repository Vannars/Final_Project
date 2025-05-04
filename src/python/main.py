# Importing a bunch - remember to activate .venv otherwise none of this works 
import sys
import json
import uuid
import spacy
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from collections import defaultdict

# Import local module - context_conditions.py - splitting text and boundaries etc
from context_conditions import format_context
from context_conditions import split_by_commas, split_by_semicolon

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
def get_question(answer, context, max_length=4000): # I mean if sentence is longer than 250 it should probably be spliced up regardlesss
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


# Build a tree for a sentence, splitting by commas for subchildren
def build_sentence_tree(sentence, context):
    parts = (split_by_commas(sentence) + split_by_semicolon(sentence))
    if not parts:
        return None
    parent = {
        "Question": get_question(parts[0], context).replace("<pad> question: ", "").replace("</s>", "").strip(),
        "Answer": format_context(parts[0]),
        "QAID": str(uuid.uuid4()),
        "children": []
    }
    # Adds comma split children if any
    for child_part in parts[1:]:
        child_node = {
            "Question": get_question(child_part, context).replace("<pad> question: ", "").replace("</s>", "").strip(),
            "Answer": format_context(child_part),
            "QAID": str(uuid.uuid4()),
            "children": []
        }
        parent["children"].append(child_node)
    return parent

#  Paragraph hierarchy logic with comma-split subchildren
def gen_questions_paragraph_hierarchy(text):
    paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    nodes = []

    for para in paragraphs:
        sentences = get_sentences(para)
        if not sentences:
            continue
        # First sentence is the top-level node (with comma split)
        first_sentence_tree = build_sentence_tree(sentences[0], para)
        # Children are the rest of the sentences, each split by commas for their own subchildren
        for sent in sentences[1:]:
            child_tree = build_sentence_tree(sent, para)
            if child_tree:
                first_sentence_tree["children"].append(child_tree)
        nodes.append(first_sentence_tree)
    return nodes

def output_main(context_arg=None): #check input text in main for the sister condition 
    default_context = (
        "The answer to life the universe and everything is 42. This quote comes from the Hitchhikers guide to the galaxy by Douglas Adams."
    )
    context_to_use = context_arg if context_arg else default_context
    children = gen_questions_paragraph_hierarchy(context_to_use)

    result = {
        "Question": "Root",
        "QAID": "Root",
        "children": children
    }

    mindmap_data = {
        "Question": result["Question"],
        "QAID": result["QAID"],
        "children": [ # keep this structure for compatibility
            {
                "Question": item["Question"],
                "Answer": item["Answer"],
                "QAID": item["QAID"],
                "children": item["children"]
            } for item in result["children"]
        ]
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